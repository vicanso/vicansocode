jQuery () ->
  $('#contentContainer').flexigrid {
    url : '/ys/table'
    dataType : 'json'
    # width : 600
    height : 500
    colModel : [
        {
            display : '条形码'
            name : 'barcode'
            width : 120
            sortable : true
            align : 'center'
        }
        {
            display : '商品名'
            name : 'title'
            width : 250
            align : 'center'
        }
        {
            display : '规格'
            name : 'specification'
            width : 120
            align : 'center'
        }
        # {
        #     display : '包装'
        #     name : 'package'
        #     width : 80
        #     align : 'center'
        # }
    ]

  }


# //-   $("#flex1").flexigrid({
# //-   url: 'post2.php',
# //-   dataType: 'json',
# //-   colModel : [
# //-     {display: 'ISO', name : 'iso', width : 40, sortable : true, align: 'center'},
# //-     {display: 'Name', name : 'name', width : 180, sortable : true, align: 'left'},
# //-     {display: 'Printable Name', name : 'printable_name', width : 120, sortable : true, align: 'left'},
# //-     {display: 'ISO3', name : 'iso3', width : 130, sortable : true, align: 'left', hide: true},
# //-     {display: 'Number Code', name : 'numcode', width : 80, sortable : true, align: 'right'}
# //-     ],
# //-   buttons : [
# //-     {name: 'Add', bclass: 'add', onpress : test},
# //-     {name: 'Delete', bclass: 'delete', onpress : test},
# //-     {separator: true}
# //-     ],
# //-   searchitems : [
# //-     {display: 'ISO', name : 'iso'},
# //-     {display: 'Name', name : 'name', isdefault: true}
# //-     ],
# //-   sortname: "iso",
# //-   sortorder: "asc",
# //-   usepager: true,
# //-   title: 'Countries',
# //-   useRp: true,
# //-   rp: 15,
# //-   showTableToggleBtn: true,
# //-   width: 700,
# //-   height: 200
# //- }); 