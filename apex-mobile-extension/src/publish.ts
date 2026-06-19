// Static Site Publish Hooks
// Triggers deployment to Vercel, Sider, or Netlify after a successful push.

export type PublishTarget = 'vercel' | 'netlify' | 'sider';

export async function publish(target: PublishTarget) {
  // TODO: call the appropriate deployment webhook for the given target
  void target;
}
