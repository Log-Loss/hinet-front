const menuData = [{
  icon: 'team',
  name: 'Community',
  path: 'community',
}, {
  icon: 'book',
  name: 'My Posts',
  path: 'posts',
}, {
  icon: 'edit',
  name: 'My Read List',
  path: 'read',
},{
  name: '异常页',
  icon: 'warning',
  hideInMenu: true,
  path: 'exception',
  children: [{
    name: '403',
    path: '403',
  }, {
    name: '404',
    path: '404',
  }, {
    name: '500',
    path: '500',
  }, {
    name: '触发异常',
    path: 'trigger',
  }],
}];

function formatter(data, parentPath = '') {
  return data.map((item) => {
    const result = {
      ...item,
      path: `${parentPath}${item.path}`,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
