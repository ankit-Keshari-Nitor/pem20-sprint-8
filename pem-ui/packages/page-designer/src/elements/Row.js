import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { ROW } from '../constants/constants';
import Column from './Column';
import { Grid, Column as Carboncolumn } from '@carbon/react';

const Row = ({ data, handleDrop, path, componentMapper, selectedField, renderRow, deleteFormField }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: ROW,
      id: data.id,
      children: data.children,
      path,
      component: data.component
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const renderColumn = (column, currentPath, renderRow) => {
    return (
      <Carboncolumn onClick={(e) => selectedField(e, column, currentPath)} lg={column.customsize ? Number(column.customsize) : Number(column.defaultsize)} className="column-zone">
        <Column
          key={column.id}
          data={column}
          handleDrop={handleDrop}
          path={currentPath}
          componentMapper={componentMapper}
          selectedField={selectedField}
          renderRow={renderRow}
          deleteFormField={deleteFormField}
        />
      </Carboncolumn>
    );
  };
  return (
    <div ref={ref} style={{ opacity }} className="base row">
      <div className="columns">
        <Grid className="custom-grid">
          {data.children.map((column, index) => {
            const currentPath = `${path}-${index}`;

            return (
              <React.Fragment key={column.id}>
                {/* <DropZone
                data={{
                  path: currentPath,
                  childrenCount: data.children.length
                }}
                onDrop={handleDrop}
                className="horizontalDrag gopal"
              /> */}
                {renderColumn(column, currentPath, renderRow)}
              </React.Fragment>
            );
          })}
        </Grid>
        {/* <DropZone
          data={{
            path: `${path}-${data.children.length}`,
            childrenCount: data.children.length
          }}
          onDrop={handleDrop}
          className="horizontalDrag 00"
          isLast
        /> */}
      </div>
    </div>
  );
};
export default Row;
