const fs = require('fs');
const {join} = require('path');
const Router = require('koa-router');
const mongoose = require('mongoose');
const koaBody = require('koa-body');
const nanoid = require('nanoid');
const router = new Router();
const isProd = process.env.NODE_ENV === 'production';

const imgTransfor = function async(body) { // todo filter tep image
	return new Promise((res,rej) => {
		const {cover, MD, HTML} = body;
		const defaultImg = 'https://static.topdiantop.top/images/blog_default_bg.jpg'
		res();
	})
}

const saveCatsIt = (cats, id) => {
	const art_id = id + '';
	const Category = mongoose.model('Category');
	return new Promise(async (res, rej) => {
		try {
			let i = 0;
			saveCat();
			async function saveCat() {
				const savedCat = await Category.findOne({title: cats[i]});
				if (savedCat) {
					const new_arts = [ ...savedCat.articles, art_id ];
					await Category.findByIdAndUpdate(savedCat._id, {articles: new_arts});
				} else {
					const catModel = new Category({title: cats[i], articles: [ art_id ]});
					await catModel.save();
				}
				i++;
				if (i >= cats.length) {
					return res();
				} else {
					saveCat();
				}
			}
		} catch (err) {
			rej(err);
		}
	});
};
const removeCatsIt = (remove_cats, art_id) => {
	const Category = mongoose.model('Category');
	return new Promise(async (res, rej) => {
		try {
			let i = 0;
			removeCat();
			async function removeCat() {
				const savedCat = await Category.findOne({title: remove_cats[i]});
				const old_arts = savedCat.articles;
				let new_arts = [];
				for (let i = 0; i < old_arts.length; i++) {
					// console.log(old_arts[i] + ' : ' + art_id, old_arts[i].toString() === art_id.toString());
					if (old_arts[i].toString() !== art_id.toString()) {
						new_arts.push(old_arts[i]);
					}
				}
				// console.log('new_arts:', new_arts);
				await Category.findByIdAndUpdate(savedCat._id, {articles: new_arts});
			}
			i++;
			if (i >= remove_cats.length) {
				return res();
			} else {
				removeCat();
			}
		} catch (err) {
			rej(err);
		}
	});
};
// 200 成功; 401 未登录; 444 没有权限; 403 已存在;

const auth = (role) => (ctx, next) => {
	if (!ctx.session.user) {
		ctx.body = {
			sucess: false,
			code: 401,
			msg: '请重新登录!'
		};
	} else if (role && ctx.session.user.role !== role) {
		ctx.body = {
			sucess: false,
			code: 444,
			msg: '你没有操作权限!'
		};
	} else {
		return next();
	}
};

const checkPoster = (_) => async (ctx, next) => {
	const Article = mongoose.model('Article');
	const saved_art = await Article.findById(ctx.params.id);
	const regPoster = saved_art.poster;
	if (ctx.session.user.userName !== regPoster) {
		return (ctx.body = {
			code: 444,
			sucess: false,
			msg: '你不能编辑其他发布者的文章!'
		});
	} else {
		return next();
	}
};
router.get('/blog/admin/checkLogin', (ctx, next) => {
	if (ctx.session.user && ctx.session.user.userName !== '') {
		return (ctx.body = {
			sucess: true,
			code: 200,
			msg: '已登陆',
			data: {
				userName: ctx.session.user.userName
			}
		});
	}
	ctx.body = {
		sucess: true,
		code: 401,
		msg: '请重新登录!'
	};
});
router.get('/blog/admin/logout', (ctx, next) => {
	ctx.session = null;
	ctx.body = {
		sucess: true,
		code: 200,
		msg: '登出成功!'
	};
});
router.post('/blog/admin/publish', auth(), koaBody(), async (ctx, next) => {
	const Article = mongoose.model('Article');
	let body = ctx.request.body;
	body.poster = ctx.session.user.userName;
	body.editor = ctx.session.user.userName;
	// await imgTransfor(body);
	const cats = body.categories;
	const artModel = new Article(body);
	const art_doc = await artModel.save();
	const art_id = art_doc._id;

	// 更新文章categories
	if (cats.length > 0) {
		await saveCatsIt(cats, art_id);
	}
	ctx.body = {
		sucess: true,
		code: 200,
		msg: '保存文章成功'
	};
});

router.get('/blog/article/list', async (ctx, next) => {
	const qs = ctx.request.query;
	const page = Number(qs.page || 1) - 1;
	const size = Number(qs.size || 10);
	const Article = mongoose.model('Article');
	const total = await Article.count();
	const skipCount = page * size;
	const doc = await Article.find().skip(skipCount).limit(size);
	const hasMore = skipCount + doc.length < total;
	const res = {
		size,
		total,
		data: doc,
		hasMore,
		page: page + 1
	};
	ctx.body = {
		sucess: true,
		code: 200,
		msg: '成功',
		data: res
	};
});

router.get('/blog/article/search', async (ctx, next) => {
	const qs = ctx.request.query;
	const key = qs.keywords;
	const page = Number(qs.page || 1) - 1;
	const size = Number(qs.size || 10);
	const Article = mongoose.model('Article');
	const skip = page * size;
	const keyword = new RegExp(`${key}`);
	const total = await Article.find({MD: keyword}).count();
	const art_doc = await Article.find({MD: keyword}).skip(skip).limit(size);
	const hasMore = skip + art_doc.length < total;
	const res = {
		size,
		total,
		data: art_doc,
		hasMore,
		page: page + 1
	};
	ctx.body = {
		sucess: true,
		code: 200,
		msg: '成功',
		data: res
	};
});

router.get('/blog/article/detail/:id', async (ctx, next) => {
	const Article = mongoose.model('Article');
	const art_id = ctx.params.id;
	const artOne = await Article.findById(art_id);
	await Article.findByIdAndUpdate(art_id, {readCount: artOne.readCount + 1});
	const preArr = await Article.find({_id: {$lt: art_id}});
	const preData = preArr && preArr[preArr.length - 1];
	const nextData = await Article.findOne({_id: {$gt: art_id}});
	ctx.body = {
		sucess: true,
		code: 200,
		msg: '成功',
		data: {
			preData,
			nextData,
			data: artOne
		}
	};
});
router.post('/blog/article/update/:id', auth(), koaBody(), checkPoster(), async (ctx, next) => {
	const id = ctx.params.id;
	const Article = mongoose.model('Article');
	let body = ctx.request.body;
	body.editor = ctx.session.user.userName;
	const oldDoc = await Article.findByIdAndUpdate(id, body); //更新文章
	const updateDoc = await Article.findById(id);
	const new_cats = updateDoc.categories;
	const old_cats = oldDoc.categories;
	let add_cats = [];
	let remove_cats = [];

	for (let i = 0; i < old_cats.length; i++) {
		for (let j = 0; j < new_cats.length; j++) {
			if (old_cats[i] === new_cats[j]) break;
			if (old_cats[i] !== new_cats[j] && j === new_cats.length - 1) {
				remove_cats.push(old_cats[i]);
			}
		}
	}
	for (let i = 0; i < new_cats.length; i++) {
		for (let j = 0; j < old_cats.length; j++) {
			if (new_cats[i] === old_cats[j]) break;
			if (new_cats[i] !== old_cats[j] && j === old_cats.length - 1) {
				add_cats.push(new_cats[i]);
			}
		}
	}
	// console.log(add_cats, remove_cats);
	if (add_cats.length > 0) {
		await saveCatsIt(add_cats, oldDoc._id);
	}
	if (remove_cats.length > 0) {
		await removeCatsIt(remove_cats, oldDoc._id);
	}

	ctx.body = {
		sucess: true,
		code: 200,
		msg: '更新文章成功'
	};
});
router.get('/blog/getListByCategory/:id', async (ctx, next) => {
	const qs = ctx.request.query;
	const page = Number(qs.page || 1) - 1;
	const size = Number(qs.size || 10);
	const type = ctx.params.id;
	const Article = mongoose.model('Article');
	const Category = mongoose.model('Category');
	const cat = await Category.findOne({title: type});
	if (cat) {
		const conditions = cat.articles.map((item) => ({_id: item}));
		const skipCount = page * size;
		const res = await Article.find({$or: conditions}).skip(skipCount).limit(size);
		const total = await Article.find({$or: conditions}).count();
		const resData = {
			size,
			total,
			data: res,
			page: page + 1
		};
		ctx.body = {
			sucess: true,
			code: 200,
			msg: '成功',
			data: resData
		};
	} else {
		ctx.body = {
			sucess: true,
			code: 200,
			msg: '成功',
			data: {
				size: 1,
				total: 0,
				data: [],
				page: page + 1
			}
		};
	}
});

router.post('/blog/user/login', koaBody(), async (ctx, next) => {
	const {body} = ctx.request;
	const User = mongoose.model('User');
	const data = {userName: body.userName, password: body.password};
	const matchUser = await User.findOne(data);
	if (!matchUser) {
		return (ctx.body = {
			sucess: true,
			code: 404,
			msg: '用户名或密码不正确!'
		});
	}
	ctx.session.user = {
		userName: matchUser.userName,
		role: matchUser.role
	};
	// ctx.cookies.set('blog:sess',JSON.stringify(user))

	ctx.body = {
		sucess: true,
		code: 200,
		msg: '登录成功!'
	};
});
router.post('/blog/user/register', koaBody(), async (ctx, next) => {
	const {body} = ctx.request;
	const User = mongoose.model('User');
	const matchUser = await User.findOne({userName: body.userName});
	if (matchUser) {
		return (ctx.body = {
			sucess: true,
			code: 403,
			msg: '用户名已存在!'
		});
	}
	const matchEmail = await User.findOne({email: body.email});
	if (matchEmail) {
		return (ctx.body = {
			sucess: true,
			code: 403,
			msg: '邮箱已存在!'
		});
	}
	const addUser = new User(body);
	const res = await addUser.save();
	if (res) {
		ctx.body = {
			sucess: true,
			code: 200,
			msg: '登录成功!'
		};
	}
});
router.get('/blog/article/del/:id', auth('admin'), async (ctx, next) => {
	const id = ctx.params.id;

	const Article = mongoose.model('Article');
	const res = await Article.findByIdAndRemove(id);
	if (!res) {
		return (ctx.body = {
			sucess: true,
			code: 200,
			msg: '文章不存在!'
		});
	}
	ctx.body = {
		sucess: true,
		code: 200,
		msg: '删除文章成功!'
	};
});

router.post(
	'/blog/upload',
	koaBody({
		multipart: true
	}),
	async (ctx) => {
		const {file} = ctx.request.body.files;
		const ext = file.type.split('/')[1];
		const fileName = `${nanoid()}.${ext}`;
		const prePath = isProd ? '/home/www/static/images/blog/': join(__dirname,'../../upload/')
		try {
			await fs.rename(file.path, `${prePath}${fileName}`, () => {});
			ctx.body = {
				sucess: true,
				code: 200,
				data: {
					url: isProd ? `https://static.topdiantop.top/images/blog/${fileName}`: `http://10.165.1.155:5000/${fileName}`
				},
				msg: '上传文件成功'
			};
		} catch (err) {
			ctx.body = {
				sucess: false,
				code: 500,
				msg: '上传文件失败'
			};
			ctx.status = 201
		}
	}
);

module.exports = router;
