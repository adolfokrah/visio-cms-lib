import { Block, Color } from '@/lib/exposed-types';
import List from '../exposed-components/list';
import { cn } from '@/lib/utils';
import Text from '../exposed-components/text';

type TableProps = {
  pageBlockId?: string;
  rows: { cells: { data: string }[] }[];
  books?: { cells: { data: string }[] }[];
  backgroundColor: Color;
};

const Table: Block<TableProps> = ({ rows, pageBlockId = '', backgroundColor }) => {
  return (
    <table style={{ background: backgroundColor?.colorHex }}>
      <List
        component="tbody"
        defaultPropValues={rows}
        propName="rows"
        itemComponent="tr"
        pageBlockId={pageBlockId}
        listItemClassName="visio-cms-bg-dark-900"
        renderComponent={(row, index) => (
          <List
            component=""
            key={`${index}`}
            defaultPropValues={row.cells}
            propName={`rows.${index}.cells`}
            pageBlockId={pageBlockId}
            itemComponent="td"
            listItemClassName={cn('visio-cms-p-3 visio-cms-text-white', {
              'visio-cms-font-semibold visio-cms-bg-dark-700 !visio-cms-bg-dark-700': index === 0,
              'visio-cms-text-sm': index > 0,
              'visio-cms-bg-dark-800': index % 2 == 0,
            })}
            renderComponent={(cell, cellIndex) => (
              <>
                {cellIndex > 0 ? (
                  <Text
                    pageBlockId={pageBlockId}
                    propName={`rows.${index}.cells.${cellIndex}.data`}
                    defaultValue={cell.data}
                  />
                ) : (
                  <>{index < 1 ? 'Id' : index}</>
                )}
              </>
            )}
          />
        )}
      />
    </table>
  );
};

Table.Schema = {
  id: 'books',
  name: 'Books',
  defaultPropValues: {
    rows: [{ cells: [{ data: '1' }, { data: '2' }] }, { cells: [{ data: '1' }, { data: '2' }] }],
    backgroundColor: { colorHex: '#000000', id: '1', colorName: 'Black' },
  },
  sideEditingProps: [
    {
      type: 'color',
      propName: 'backgroundColor',
      label: 'Background Color',
      group: 'Background',
    },
    {
      type: 'color',
      propName: 'backgroundColor',
      label: 'Background Color',
    },
  ],
  lists: [
    {
      propName: 'rows',
      label: 'Row',
      defaultValue: { cells: [{ data: '1' }, { data: '2' }] },
      subLists: [
        {
          propName: 'rows.cells',
          label: 'Cell',
          defaultValue: { data: '1' },
          sideEditingProps: [],
        },
      ],
    },
  ],
};

export default Table;
