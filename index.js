/** Host-owned, profile-persistent opt-in. No task or session data is accessed. */
import s from '@deepseek-ai/schemastery'

export const name = 'tavlo-paper-theme'
export const Config = s.object({
  appearance: s.union(['default', 'ios', 'paper']).default('default').volatile(),
  taskAppearance: s.union(['inherit', 'ios', 'paper']).default('inherit').volatile(),
})

/** The dedicated settings section owns editing instead of the generic form. */
export function apply(ctx) {
  ctx.inject(['settings'], child => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber))
  })
}
