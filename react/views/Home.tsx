import { useContext } from 'react';
import { Button, Tabs, Tooltip } from 'antd';
import { BookOutlined, BookFilled } from '@ant-design/icons';

import { ThemeContext } from '../contexts';
import { Buttons, Spacings } from '../components';

const MenuTabs = [
  {
    id: 'buttons-tab',
    label: 'Buttons',
    children: <Buttons />
  },
  {
    id: 'spacings-tab',
    label: 'Spacings',
    children: <Spacings />
  },
];

export const Home = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div style={{ width: '100%', maxHeight: '35rem', height: '35rem', backgroundColor: 'var(--theme-bg-primary)', position: 'relative' }}>
      <Tabs
        defaultActiveKey="1"
        tabPosition="left"
        style={{ maxHeight: '35rem', height: '35rem', color: 'var(--theme-text-primary)' }}
        items={MenuTabs.map((tab, i) => {
          return {
            label: tab.label,
            key: tab.id,
            // disabled: i === 28,
            children: (
              tab.children
            ),
          };
        })}
      />

      <div style={{ flex: 1, position: 'absolute', bottom: 20, right: 20 }}>

        {
          theme === 'dark'
            ? (

              <Tooltip title="search">
                <Button
                  onClick={toggleTheme}
                  shape="circle"
                  icon={
                    <BookOutlined />
                  }
                />
              </Tooltip>
            )
            : (
              <Tooltip title="search">
                <Button
                  onClick={toggleTheme}
                  shape="circle"
                  icon={
                    <BookFilled />
                  }
                />
              </Tooltip>
            )
        }
      </div>
    </div>
  );
};
