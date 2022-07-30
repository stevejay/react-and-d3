import { Component, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { canUseDOM } from './canUseDOM';

export class Portal extends Component<{
  children: ReactNode;
  node?: Element | DocumentFragment | null;
}> {
  defaultNode: Element | DocumentFragment | null = null;

  componentWillUnmount() {
    if (this.defaultNode) {
      document.body.removeChild(this.defaultNode);
    }
    this.defaultNode = null;
  }

  render() {
    if (!canUseDOM) {
      return null;
    }
    if (!this.props.node && !this.defaultNode) {
      this.defaultNode = document.createElement('div');
      document.body.appendChild(this.defaultNode);
    }
    return (
      <>
        {createPortal(
          this.props.children,
          (this.props.node || this.defaultNode) as Element | DocumentFragment
        )}
      </>
    );
  }
}
