import { Block, Color } from '@/lib/exposed-types';
import List from '../exposed-components/list';

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
            listItemClassName="visio-cms-p-3 visio-cms-text-white"
            renderComponent={(cell) => <>{cell.data}</>}
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
      schema: { cells: [{ data: '1' }, { data: '2' }] },
      subLists: [
        {
          propName: 'rows.cells',
          label: 'Cell',
          schema: { data: '1' },
          sideEditingProps: [
            {
              type: 'text',
              propName: 'data',
              label: 'Data',
            },
          ],
        },
      ],
    },
  ],
};

export default Table;
