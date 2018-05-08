const Router = require('koa-router')
const mongoose = require('mongoose')
const koaBody = require('koa-body')
const router = new Router()
const { getArrData } = require('./service/')
const { ObjectId } = mongoose.Schema.Types


// 200 成功; 401 未登录; 444 没有权限; 403 已存在; 

const auth = (role) => {
  return (ctx, next) => {
    if (!ctx.session.user) {
      ctx.body = {
        sucess: true,
        code: 401,
        msg: '请重新登录!'
      }
    } else if (role && ctx.session.user.role !== role) {
      ctx.body = {
        sucess: true,
        code: 444,
        msg: '你没有操作权限!'
      }
    } else {
      return next()
    }
  }

}
router.post('/blog/admin/publish', auth(), koaBody(), async (ctx, next) => {
  const Article = mongoose.model('Article')
  const Category = mongoose.model('Category')
  const body = ctx.request.body
  const cats = body.categories
  const artModel = new Article(body)
  const art_doc = await artModel.save()
  const art_id = art_doc._id
  const art_cats = art_doc.categories
  console.log('art_cats: ', art_cats)


  function saveCatsIt() {
    return new Promise(async (res, rej) => {
      try {
        let cat_ids = []
        let i = 0
        saveCat()
        async function saveCat() {
          let savedCat = await Category.findOne({ title: art_cats[i] })
          if (savedCat) {
            cat_ids.push(savedCat._id)
            savedCat.articles.push(art_id)
            console.log('newCat', savedCat.articles)
            const res = await Category.findByIdAndUpdate(savedCat._id, { articles: savedCat.articles })
            console.log(res)
          } else {
            const catModel = new Category({ title: cats[i], articles: [art_id] })
            const newCat = await catModel.save()
            cat_ids.push(newCat._id)
          }
          i++
          if (i >= cats.length) {
            return res(cat_ids)
          } else {
            saveCat()
          }

        }
      } catch (err) {
        rej(err)
      }
    })
  }

  // 更新文章categories
  await saveCatsIt()

  ctx.body = {
    sucess: true,
    code: 200,
    msg: '保存文章成功'
  }
})

router.get('/blog/article/list', async (ctx, next) => {
  const qs = ctx.request.query
  const page = Number(qs.page || 1) - 1
  const size = Number(qs.size || 10)
  const Article = mongoose.model('Article')
  const total = await Article.count()
  const skipCount = page * size
  const doc = await Article.find().skip(skipCount).limit(size)
  const hasMore = skipCount + doc.length < total
  const res = {
    size,
    total,
    data: doc,
    hasMore,
    page: page + 1,
  }
  ctx.body = {
    sucess: true,
    code: 200,
    msg: '成功',
    data: res
  }
})

router.get('/blog/article/detail/:id', async (ctx, next) => {
  const Article = mongoose.model('Article')
  const Category = mongoose.model('Category')
  const art_id = ctx.params.id
  const artOne = await Article.findById(art_id)
  await Article.findByIdAndUpdate(art_id, { readCount: artOne.readCount + 1 })
  const preArr = await Article.find({ _id: { '$lt': art_id } })
  const preData = preArr && preArr[preArr.length - 1]
  const nextData = await Article.findOne({ _id: { '$gt': art_id } })
  ctx.body = {
    sucess: true,
    code: 200,
    msg: '成功',
    data: {
      preData,
      nextData,
      data: artOne
    }
  }

})

router.get('/blog/getListByCategory/:id', async (ctx, next) => {
  const qs = ctx.request.query
  const page = Number(qs.page || 1) - 1
  const size = Number(qs.size || 10)
  const type = ctx.params.id
  const req_id = ctx.params.id
  const Article = mongoose.model('Article')
  const Category = mongoose.model('Category')
  const cat = await Category.findOne({ title: type })
  if (cat) {
    const conditions = cat.articles.map(item => ({ _id: item }))
    const skipCount = page * size
    const res = await Article.find({ "$or": conditions }).skip(skipCount).limit(size)
    const total = await Article.find({ "$or": conditions }).count()
    const resData = {
      size,
      total,
      data: res,
      page: page + 1,
    }
    ctx.body = {
      sucess: true,
      code: 200,
      msg: '成功',
      data: resData
    }
  } else {
    ctx.body = {
      sucess: true,
      code: 200,
      msg: '成功',
      data: {
        size: 1,
        total: 0,
        data: [],
        page: page + 1,
      }
    }
  }

})

router.post('/blog/user/login', koaBody(), async (ctx, next) => {
  const { body } = ctx.request
  const User = mongoose.model('User')
  const data = {userName:body.userName,password:body.password}
  const matchUser = await User.findOne(data)
  if (!matchUser) {
    return ctx.body = {
      sucess: true,
      code: 404,
      msg: '用户名或密码不正确!'
    }
  }
  ctx.session.user={
    user: matchUser.userName,
    role: matchUser.role
  }
   
  ctx.body = {
    sucess: true,
    code: 200,
    msg: '登录成功!'
  }
})
router.post('/blog/user/register', koaBody(), async (ctx, next) => {
  const { body } = ctx.request
  const User = mongoose.model('User')
  const matchUser = await User.findOne({ userName: body.userName })
  if (matchUser) {
    return ctx.body = {
      sucess: true,
      code: 403,
      msg: '用户名已存在!'
    }
  }

  const addUser = new User(body)
  console.log(addUser)
  const res = await addUser.save()
  if (res) {
    ctx.body = {
      sucess: true,
      code: 200,
      msg: '登录成功!'
    }
  }
})
router.get('/blog/article/del/:id',auth('admin'), async (ctx,next)=>{
  const id = ctx.params.id

  const Article = mongoose.model('Article')
  const res = await Article.findByIdAndRemove(id)
  if(!res){
    return ctx.body = {
      sucess: true,
      code: 200,
      msg: '文章不存在!'
    }
  }
  ctx.body = {
    sucess: true,
    code: 200,
    msg: '删除文章成功!'
  }
})

module.exports = router