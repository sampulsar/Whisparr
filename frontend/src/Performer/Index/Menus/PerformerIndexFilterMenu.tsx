import React from 'react';
import { CustomFilter } from 'App/State/AppState';
import FilterMenu from 'Components/Menu/FilterMenu';
import { align } from 'Helpers/Props';
import SceneIndexFilterModal from 'Scene/Index/SceneIndexFilterModal';

interface PerformerIndexFilterMenuProps {
  selectedFilterKey: string | number;
  filters: object[];
  customFilters: CustomFilter[];
  isDisabled: boolean;
  onFilterSelect(filterName: string): unknown;
}

function PerformerIndexFilterMenu(props: PerformerIndexFilterMenuProps) {
  const {
    selectedFilterKey,
    filters,
    customFilters,
    isDisabled,
    onFilterSelect,
  } = props;

  return (
    <FilterMenu
      alignMenu={align.RIGHT}
      isDisabled={isDisabled}
      selectedFilterKey={selectedFilterKey}
      filters={filters}
      customFilters={customFilters}
      filterModalConnectorComponent={SceneIndexFilterModal}
      onFilterSelect={onFilterSelect}
    />
  );
}

PerformerIndexFilterMenu.defaultProps = {
  showCustomFilters: false,
};

export default PerformerIndexFilterMenu;
