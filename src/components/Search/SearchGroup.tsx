import { MenuGroup, MenuItem } from '@patternfly/react-core';
import React from 'react';
import ChromeLink from '../ChromeLink';
import SearchDescription from './SearchDescription';
import SearchTitle from './SearchTitle';
import { HighlightingResponseType, SearchResultItem } from './SearchTypes';

const SearchGroup = ({
  groupLabel,
  items,
  highlighting,
}: {
  groupLabel: string;
  items: SearchResultItem[];
  highlighting: HighlightingResponseType;
}) => {
  return items.length > 0 ? (
    <MenuGroup label={groupLabel}>
      {items.map(({ id, allTitle, bundle, bundle_title, abstract, relative_uri }) => (
        <MenuItem
          component={(props) => <ChromeLink {...props} href={relative_uri} />}
          description={
            <SearchDescription highlight={highlighting[id]?.abstract} bundle={bundle[0]} description={abstract} bundleTitle={bundle_title[0]} />
          }
          key={id}
        >
          <SearchTitle title={allTitle} highlight={highlighting[id]?.allTitle} />
        </MenuItem>
      ))}
    </MenuGroup>
  ) : null;
};

export default SearchGroup;
