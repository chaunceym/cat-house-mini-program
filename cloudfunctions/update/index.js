// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const cmd = db.command
exports.main = async (event, context) => {
  if(typeof event.data === 'string'){
    event.data = eval('('+event.data+')')
  }
  try {
    return await db.collection(event.collection).doc(event.doc)
    .update({
      data: {
        ...event.data
      },
    })
  } catch(e) {
    console.error(e)
  }
}
// 云函数入口函数