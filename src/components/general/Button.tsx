import '@/styles/components/general/Button.module.css'
import { SyncOrAsync } from '@/common/types/global';
import { useRouter } from 'next/router';
import React from 'react';

type ClickListener = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => SyncOrAsync<void>;

type Selector =
  | 'primary'
  | 'secondary'
  | '';

type Style =
  | Selector
  | `${Selector} ${Selector}`
  | `${Selector} ${Selector} ${Selector}`;

/**
 * Props for a button
 */
interface Props {
  readonly styleType: Style; //button style
  readonly content?: React.ReactNode; //button content (text, icon, etc)
  readonly icon?: any;
  readonly path?: string
  readonly onClick?: ClickListener
}

/**
 * Button Basis 
 * @param props
 * @constructor
 */
export default function Button(props: Props) {
  const { styleType, icon, content, path, onClick } = props;
  const router = useRouter();

  async function onClicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    if (path) router.push(path)
    else if (onClick !== undefined) await onClick(e)
  }

  return (
    <button className={`btn ${styleType}`} onClick={onClicked}>
      {icon ?? ''}
      {content}
    </button>
  );
}
