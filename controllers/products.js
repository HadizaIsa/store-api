const products = require('../models/products');
const Product = require('../models/products');

// const getAllProducts = async(req, res) =>{
//     const products = await Product.find({
//         featured: true // Filter for products where 'featured' is true
//         // nbHits: products.length,

//     })
//     res.status(200).json({products, nbHits: products.length})

// }


const getAllProducts = async(req, res) =>{
    const { featured, company, name, sort, fields, numericFilters} = req.query;
    const queryObject = {}

    if (featured) {
        queryObject.featured = featured === 'true' ? true: false;
    }

    if (name) {
        queryObject.name = {$regex: name, $options: 'i'};
    }

    if(company){
        queryObject.company = company;
    }

    if(numericfilters){
        const operatorMap ={
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte'
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(
            regEx,
            (match)=> `-${operatorMap[match]}-`
        );
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) =>{
            const [field, operator, value] = item.split('-')
            if(options.includes(field)){
                queryObject[field] = { [operator] :Number(value)};
            }
        });
    }

    let result = await Product.find(queryObject);
    // sort
    if(sort){
        const sortList =sort.split(',').join(' ');
        result = result.sort(sortList);

    }
    else{
        result = result.sort('createdAt');
    }

    if(fields){
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);

    }


    

    const page =  Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const products = await result;
    res.status(200).json({products, nbHits: products.length})

}

const createProduct = async (req, res) =>{
    res.status(201).json({msg: 'created'})
}

const getProduct = async(req, res) =>{
    // const {} = 
    res.status(200).json({msg: 'single product gotten'})


}

const updateProduct = async (req,res) =>{
    res.status(200).json({msg: 'updated'})
}


const deleteProduct= async (req, res) =>{
    res.json({msg: 'product deleted'})
}

module.exports = {
    getAllProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct
}