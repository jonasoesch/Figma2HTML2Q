import { mount, unmount } from 'svelte';
import App from './App.svelte';
import './main.scss';
import type { AppProps } from './interfaces/general';

class AppWrapper {
  private app: ReturnType<typeof mount>;

  constructor(options: { target: HTMLElement; props?: AppProps }) {
    this.app = mount(App, {
      target: options.target,
      props: options.props || ({} as AppProps),
    });
  }

  $destroy() {
    unmount(this.app);
  }
}

export { AppWrapper as App };
