import { Plugin } from "@opencode/plugin";

// V2 currently preserves `agents.researcher.request.body.temperature` but
// does not apply it to model requests. Set the same value via a V2 hook.
export default Plugin.define({
  id: "researcher-temperature",
  async setup(ctx) {
    await ctx.session.hook("context", (event) => {
      if (event.agent === "researcher") event.options.temperature = 0.1;
    });
  },
});
