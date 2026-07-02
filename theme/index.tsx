import { Layout as OriginalLayout } from '@theme-original';
import type { LayoutProps } from '@rspress/core/theme-original';
import mdxComponents from './mdx-components';
import './styles.css';

export function Layout(props: LayoutProps) {
  return <OriginalLayout {...props} components={{ ...mdxComponents, ...props.components }} />;
}

export { Root } from '@rspress/core/theme-original';
export * from '@rspress/core/theme-original';
