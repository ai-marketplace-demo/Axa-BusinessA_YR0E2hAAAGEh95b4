

const Topics = Object.keys({
    Finances: 'Finances',
    HumanResources: 'HumanResources',
    Products: 'Products',
    Services: 'Services',
    Operations: 'Operations',
    Research: 'Research',
    Sales: 'Sales',
    Orders: 'Orders',
    Sites: 'Sites',
    Energy: 'Energy',
    Customers: 'Customers',
    Misc: 'Misc'
}).map((k) => ({ label: k, value: k }));

export { Topics };
