import {
  Dropdown,
  DropdownContent,
  DropdownContentWrapper,
  List,
  ListItem,
  Separator,
} from "./components";
import type { Page } from "./pages";
import {
  SelectableDropdownButton,
  SelectableDropdownItemButton,
  SelectableNavLink,
} from "./SelectableButtons";

export default function Menu({ pages }: { pages: Record<string, Page> }) {
  return (
    <List>
      {Object.entries(pages).map(([pageKey, page]) =>
        page.type === "separator" ? (
          <Separator key={pageKey} />
        ) : page.type === "normal" ? (
          <ListItem key={page.path}>
            <SelectableNavLink path={page.path}>{page.label}</SelectableNavLink>
          </ListItem>
        ) : (
          <Dropdown key={page.label}>
            <SelectableDropdownButton page={page}>
              {page.label}
            </SelectableDropdownButton>
            <DropdownContentWrapper>
              <DropdownContent>
                {Object.entries(page.menu).map(([linkKey, link]) => (
                  <SelectableDropdownItemButton key={linkKey} path={link.path}>
                    {link.label}
                  </SelectableDropdownItemButton>
                ))}
              </DropdownContent>
            </DropdownContentWrapper>
          </Dropdown>
        ),
      )}
    </List>
  );
}
