import { importShapes, exportShapes } from '../utils/exportimport'
import { isEmpty } from 'lodash'
import { defaultPathThickness, shapeList } from '../utils/constants'
import { SidebarProps } from '../interfaces'
import Button from './ui/Button'

export default function Sidebar({
  clearShapes,
  createShape,
  setShapeType,
  shapes,
  shapeType,
  toggleViewMode,
  is3DMode,
  pathThickness,
  setPathThickness,
}: Readonly<SidebarProps>) {
  const importFunc = (event: React.ChangeEvent<HTMLInputElement>) => {
    importShapes({ event, createShape, clearShapes })
  }

  const setThickness = (thickness: number) => {
    if (thickness < 1 || isNaN(thickness)) thickness = defaultPathThickness

    setPathThickness(thickness)
  }
  const iconList = ['rectangle', 'circle', 'horizontal_rule', 'route']

  return (
    <div className='lg:w-1/4 mb-4 lg:mb-0'>
      {!is3DMode && (
        <div className='bg-white rounded-lg shadow-lg p-6 mb-2'>
          <div className='text-xl font-bold text-red-500 mb-2'>SHAPES</div>
          <ul className='space-y-2'>
            {shapeList.map((type, index) => (
              <li key={type}>
                <Button
                  onClick={() => setShapeType(type)}
                  isActive={shapeType === type} // pass the active status
                >
                  <span className='material-icons mr-2'>{iconList[index]}</span>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>

                {['line', 'path'].includes(type) && shapeType === type && (
                  <div className='w-full my-4 flex items-center justify-between'>
                    <span className='text-gray-500 text-xs'>Path thickness:</span>
                    <input
                      type='number'
                      value={pathThickness}
                      onChange={e => setThickness(Number(e.target.value))}
                      className='p-2 border border-gray-200 rounded-md focus:outline-none focus:shadow-outline w-32'
                      placeholder='Path thickness'
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className='bg-white rounded-lg shadow-lg p-6'>
        <div className='text-xl font-bold text-red-500 mb-2'>ACTIONS</div>

        {!is3DMode && (
          <>
            <Button onClick={clearShapes}>
              <span className='material-icons mr-2'>delete_forever</span>Clear All
            </Button>

            {!isEmpty(shapes) && (
              <Button
                onClick={() => exportShapes(shapes)}
                className='mt-2'
              >
                <span className='material-icons mr-2'>ios_share</span> Export Shapes
              </Button>
            )}

            <input
              type='file'
              id='files'
              className='hidden'
              onChange={importFunc}
              accept='.json'
            />
            <label
              htmlFor='files'
              className='flex items-center w-full space-x-2 text-gray-100 p-3 rounded-md transition-all duration-150 transform hover:scale-105 hover:text-white focus:outline-none focus:shadow-outline bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mt-2'
            >
              <span className='material-icons mr-2'>library_add</span> Import Shapes
            </label>
          </>
        )}

        <Button
          onClick={toggleViewMode}
          className='mt-2'
        >
          <span className='material-icons mr-2'>{is3DMode ? 'view_in_ar' : '3d_rotation'}</span>
          {is3DMode ? 'Switch to 2D' : 'View in 3D'}
        </Button>
      </div>
    </div>
  )
}
