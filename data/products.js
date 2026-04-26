const sadaImage = '/images/product-sada.jpeg';
const mahmoogImage = '/images/product-mahmoog.jpeg';

const products = [
  {
    id: 'brazilian-plain',
    name: 'برازيلي سادة',
    category: 'قهوة برازيلي',
    type: 'سادة',
    weight: '250 جم',
    price: 60,
    image: sadaImage,
    description: 'تحميص متوسط بنكهة متوازنة وقوام ناعم مناسب للقهوة اليومية.'
  },
  {
    id: 'brazilian-blend',
    name: 'برازيلي محوج',
    category: 'قهوة برازيلي',
    type: 'محوج',
    weight: '250 جم',
    price: 60,
    image: mahmoogImage,
    description: 'خلطة برازيلي محوجة بعطر غني ولمسة بهارات دافئة.'
  },
  {
    id: 'turkish-plain',
    name: 'تركي سادة',
    category: 'قهوة تركي',
    type: 'سادة',
    weight: '250 جم',
    price: 50,
    image: sadaImage,
    description: 'قهوة تركي سادة بطحن ناعم وقوام مركز لعشاق المذاق الصافي.'
  },
  {
    id: 'turkish-blend',
    name: 'تركي محوج',
    category: 'قهوة تركي',
    type: 'محوج',
    weight: '250 جم',
    price: 50,
    image: mahmoogImage,
    description: 'قهوة تركي محوجة بطابع شرقي فاخر ورائحة مميزة.'
  },
  {
    id: 'yemeni-plain',
    name: 'يمني سادة',
    category: 'قهوة يمني',
    type: 'سادة',
    weight: '250 جم',
    price: 80,
    image: sadaImage,
    description: 'بن يمني فاخر بنغمات عميقة وحموضة خفيفة متوازنة.'
  },
  {
    id: 'yemeni-blend',
    name: 'يمني محوج',
    category: 'قهوة يمني',
    type: 'محوج',
    weight: '250 جم',
    price: 85,
    image: mahmoogImage,
    description: 'خلطة يمني محوجة بنكهة قوية وعمق واضح في كل فنجان.'
  },
  {
    id: 'espresso',
    name: 'إسبريسو',
    category: 'قهوة إسبريسو',
    type: 'محمص',
    weight: '1000 جم',
    price: 300,
    image: mahmoogImage,
    description: 'حبوب إسبريسو احترافية بكريمة ثابتة ونكهة شوكولاتة مكثفة.'
  }
];

export default products;
