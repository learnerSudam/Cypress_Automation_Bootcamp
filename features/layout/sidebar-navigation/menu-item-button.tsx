import React from "react";
import { Button } from "@features/ui";
import { ListItem, Anchor, Icon } from "./menu-item-link";

type MenuItemProps = {
  className?: string;
  text: string;
  iconSrc: string;
  onClick: () => void;
  isCollapsed: boolean;
  dataCy: string;
};

export function MenuItemButton({
  className,
  text,
  onClick,
  iconSrc,
  isCollapsed,
  dataCy,
}: MenuItemProps) {
  return (
    <ListItem className={className}>
      <Anchor as={Button} onClick={onClick} data-cy={dataCy}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Icon src={iconSrc} alt={`${text} icon`} /> {!isCollapsed && text}
      </Anchor>
    </ListItem>
  );
}
