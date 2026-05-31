# Kotlin / JUnit 5 Transaction Propagation Examples

## Avoid self-invocation for REQUIRES_NEW

Bad pattern:

```kotlin
@Service
class OrderWorkflowService(
    private val orderRepository: OrderRepository,
    private val auditRepository: OrderAuditRepository,
) {
    @Transactional
    fun placeOrder(command: PlaceOrderCommand) {
        orderRepository.save(command.toOrder())
        recordAudit(command.orderReference) // self-invocation bypasses proxy advice
        error("Simulated failure")
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun recordAudit(orderReference: String) {
        auditRepository.save(OrderAuditRecord(orderReference = orderReference))
    }
}
```

Preferred split:

```kotlin
@Service
class OrderWorkflowService(
    private val orderRepository: OrderRepository,
    private val auditService: OrderAuditService,
) {
    @Transactional
    fun placeOrderAndFail(command: PlaceOrderCommand) {
        orderRepository.save(command.toOrder())
        auditService.recordAttempt(command.orderReference)
        error("Simulated failure after audit")
    }
}

@Service
class OrderAuditService(
    private val auditRepository: OrderAuditRepository,
) {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun recordAttempt(orderReference: String) {
        auditRepository.save(OrderAuditRecord(orderReference = orderReference))
    }
}
```

## REQUIRES_NEW integration test

```kotlin
@SpringBootTest
@ActiveProfiles("test")
class OrderWorkflowTransactionTest(
    @Autowired private val workflowService: OrderWorkflowService,
    @Autowired private val orderRepository: OrderRepository,
    @Autowired private val auditRepository: OrderAuditRepository,
    @Autowired private val entityManager: EntityManager,
) {
    @BeforeEach
    fun cleanDatabase() {
        auditRepository.deleteAll()
        orderRepository.deleteAll()
    }

    @Test
    fun `audit commits when outer order transaction rolls back`() {
        val command = PlaceOrderCommand(orderReference = "ORD-1001")

        assertThrows<IllegalStateException> {
            workflowService.placeOrderAndFail(command)
        }

        entityManager.clear()

        assertThat(orderRepository.findAll()).isEmpty()
        assertThat(auditRepository.findAll()).hasSize(1)
        assertThat(auditRepository.findAll().single().orderReference).isEqualTo("ORD-1001")
    }
}
```

## MANDATORY with TransactionTemplate

```kotlin
@Service
class MandatoryTransactionProbe {
    @Transactional(propagation = Propagation.MANDATORY)
    fun isTransactionActive(): Boolean =
        TransactionSynchronizationManager.isActualTransactionActive()
}
```

```kotlin
@SpringBootTest
@ActiveProfiles("test")
class MandatoryTransactionProbeTest(
    @Autowired private val probe: MandatoryTransactionProbe,
    @Autowired private val transactionTemplate: TransactionTemplate,
) {
    @Test
    fun `mandatory method fails outside transaction`() {
        assertThrows<IllegalTransactionStateException> {
            probe.isTransactionActive()
        }
    }

    @Test
    fun `mandatory method succeeds inside transaction`() {
        transactionTemplate.executeWithoutResult {
            assertThat(probe.isTransactionActive()).isTrue()
        }
    }
}
```

## Proxy diagnostic

```kotlin
@SpringBootTest
class TransactionProxySmokeTest(
    @Autowired private val orderWorkflowService: OrderWorkflowService,
) {
    @Test
    fun `service is proxied`() {
        assertThat(AopUtils.isAopProxy(orderWorkflowService)).isTrue()
    }
}
```
