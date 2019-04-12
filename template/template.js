var temp = {
  updateRecordStatue: function (event) {
    console.log("点击了" + event.currentTarget.dataset.recordid)
  },
  delSludgeBtn:function(event) {
    console.log("删除" + event.currentTarget.dataset.sludgeid )
  },
  editSludgeBtn: function (event) {
    console.log("编辑" + event.currentTarget.dataset.sludgeid)
  },
  test:function(event){
    console.log("haha")
  }
}
//导出，供外部使用
export default temp