import React from 'react';
import { useStorageStore } from './storageStore';
import { PageTile } from '../../ui/PageTile';

export const PageTileGrid = React.memo(function PageTileGrid() {
  const { pages, selectedPageNo, setSelectedPageNo, activeFilters } = useStorageStore();

  const filteredPages = pages.length > 0 ? pages : [
    {
      pageNumber: 1,
      pageSize: 8192,
      header: {
        rawType: 0x0d,
        pageType: 'TABLE_LEAF' as const,
        typeAbbr: 'TBL-LF' as const,
        firstFreeblock: 0,
        cellCount: 0,
        cellContentStart: 8192,
        fragmentedBytes: 0,
        headerOffset: 100,
        headerSize: 8,
      },
      cellPointers: [],
      cells: [],
      freeSpaceBytes: 8084,
      fillPercentage: 1,
    },
  ];

  const visiblePages = filteredPages.filter((p) =>
    activeFilters.has(p.header.typeAbbr as any)
  );

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {visiblePages.map((page) => (
        <PageTile
          key={page.pageNumber}
          pageNumber={page.pageNumber}
          typeAbbr={page.header.typeAbbr}
          cellCount={page.header.cellCount}
          fillPercentage={page.fillPercentage}
          isSelected={page.pageNumber === selectedPageNo}
          onClick={() => setSelectedPageNo(page.pageNumber)}
        />
      ))}
    </div>
  );
});
