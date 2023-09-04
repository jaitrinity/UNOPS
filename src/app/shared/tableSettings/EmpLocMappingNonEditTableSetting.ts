export class EmpLocMappingNonEditTableSetting{
    public static setting = {
        mode: 'external',
        hideSubHeader: false,
        actions: {
          position: 'right',
          add: false,
          edit : false,
          delete : false
        },
        pager :{
          perPage : 10
        },
        columns: {
          state:{
            title : 'Division'
          },
          city: {
            title: 'District',
          },
          area: {
            title: 'Block',
          },
          name :{
            title : 'Gram Panchayat',
          },
          address :{
            title : 'Village',
          },
          empName: {
            title: 'Employee Name'
          },
          roleName: {
            title: 'Role'
          }
        }
    }
}