const router = require('koa-router')()
const config = require('../mini-program-config')
const fs = require('fs')
const request = require('request-promise')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})
router.post('/uploadBannerImg', async (ctx, next) => {
  const files = ctx.request.files
  const file = files.file
  try{
    let options = {
      url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.APP_ID}&secret=${config.SECRET}`,
      json: true
    }
    const {access_token} = await request(options)
    const fileName = `${Date.now()}.jpg`
    const filePath = `banner/${fileName}`
    options = {
      method: 'POST',
      url: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${access_token}`,
      body: {
        "env": "mao-57ers",
        "path": filePath
      },
      json: true
    }
    const res = await request(options)
    const file_id = res.file_id

    options = {
      method: 'POST',
      url: `https://api.weixin.qq.com/tcb/databaseadd?access_token=${access_token}`,
      body: {
        "env": "mao-57ers",
        "query": `db.collection(\"banner\").add({data:{fileId:\"${file_id}\"}})`
      },
      json: true
    }
    await request(options)

    options = {
      method: 'POST',
      url: res.url,
      formData: {
        "Signature": res.authorization,
        "key": filePath,
        "x-cos-security-token": res.token,
        "x-cos-meta-fileid": res.cos_file_id,
        "file" :{
          value: fs.createReadStream(file.path),
          options:{
            filename: fileName,
            contentType: file.type
          }
        }
      }
    }
    await request(options)
    ctx.body = res
  }catch(e){
    console.log(e.stack)
  }
})


module.exports = router
