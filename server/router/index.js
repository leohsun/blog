const Router = require('koa-router')
const mongoose = require('mongoose')
const koaBody = require('koa-body')
const router = new Router()
const qs = require('querystring')
const { getArrData } = require('./service/')
const { ObjectId } = mongoose.Schema.Types

router.post('/publish', koaBody(), async (ctx, next) => {
  const Article = mongoose.model('Article')
  const Category = mongoose.model('Category')
  const body = ctx.request.body
  const cats = body.categories
  const artModel = new Article(Object.assign({}, { ...body }, { categories: [] }))
  const art_doc = await artModel.save()
  const art_id = art_doc._id
  function getCats() {
    return new Promise(async (res, rej) => {
      try {
        let cat_ids = []
        let i = 0
        saveCat()
        async function saveCat() {
          let savedCat = await Category.findOne({ title: cats[i] })
          if (savedCat) {
            cat_ids.push(savedCat._id)
            savedCat.articles.push(art_id)
            Category.findByIdAndUpdate(savedCat._id, { articles: [savedCat.articles] })
            await Article.findByIdAndUpdate(art_id, { categories: cat_ids })
          } else {
            const catModel = new Category({ title: cats[i], articles: [art_id] })
            const newCat = await catModel.save()
            cat_ids.push(newCat._id)
            await Article.findByIdAndUpdate(art_id, { categories: cat_ids })
          }
          i++
          if (i >= cats.length) {
            res(cat_ids)
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
  const cat_ids = await getCats()
  const updateArtDoc = await Article.findByIdAndUpdate(art_id, { categories: cat_ids })

  ctx.body = {
    sucess: true,
    code: 200,
    msg: '保存文章成功'
  }
})

router.get('/article/list', async (ctx, next) => {
  const qs = ctx.request.query
  const page =  Number(qs.page || 1) - 1
  const size = Number(qs.size || 10)
  const Article = mongoose.model('Article')
  const total = await Article.count()
  const skipCount = page * size
  const doc = await Article.find().skip(skipCount).limit(size)
  const hasMore = skipCount + doc.length < total
  const res = {
    size,
    total,
    data:doc,
    hasMore,
    page:page+1,
  }
  ctx.body = {
    sucess: true,
    code: 200,
    msg: '成功',
    data: res
  }
})

router.get('/article/detail/:id', async (ctx, next) => {
  const Article = mongoose.model('Article')
  const Category = mongoose.model('Category')
  const art_id = ctx.params.id
  const artOne = await Article.findById(art_id)
  await Article.findByIdAndUpdate(art_id,{readCount:artOne.readCount + 1})
  const cats = artOne ? await getArrData('Category',artOne.categories) :[]
  const catsWithTitle = cats.map(item=>item.title)
  let res = artOne ? artOne.toObject() :[]
  res.categories = catsWithTitle
  const preArr = await Article.find({_id:{'$lt':art_id}})
  const preData = preArr && preArr[preArr.length - 1]
  const nextData = await Article.findOne({_id:{'$gt':art_id}})
  ctx.body = {
    sucess: true,
    code: 200,
    msg: '成功',
    data: {
      preData,
      nextData,
      data:res
    }
  }
  
})
module.exports = router