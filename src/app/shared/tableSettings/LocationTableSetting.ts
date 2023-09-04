export class LocationTableSetting{
    public static setting = {
        mode: 'external',
        //hideHeader : true,
        hideSubHeader: false,
        actions: {
          position: 'right',
          add: false,
          edit : false,
          delete : false,
          custom: [
            { name: 'editrecord', title: 'Edit'},
            // { name: 'activerecord', title: 'Active' },
            // { name: 'deactiverecord', title: 'Deactive' },
          ],
        },
        pager :{
          perPage : 10
        },
        columns: {
          locId: {
            title: 'Location Id',
            // sort : false,
            width : '100px'
          },
          state:{
            title : 'Division'
          },
          city:{
            title : 'District'
          },
          area:{
            title : 'Block'
          },
          name: {
            title: 'Gram Panchayat	',
            // sort : false,
          },
          address: {
            title: 'Village',
            // sort : false,
          }
        }
    }
}