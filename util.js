const $toggle = (state) => state(!state())

function move(array, from, to) {
  const newArray = array.slice();
  const element = newArray.splice(from, 1)[0];

  newArray.splice(to, 0, element);
  return newArray;
}

const UiInput = {
  viewModel: function(params) {
    this.label = params.label;
    this.value = params.value;
    
    this.clear = function() { this.value(''); }.bind(this);
  },
  template: /*html*/`
    <div>
      <label data-bind="text: label" style="display: inline-block; width: 80px"></label>
      <input data-bind="value: value, valueUpdate: 'input'"/>
      <button data-bind="click: clear">X</button>
    </div>
  `
}

const props = {
  animation: 100,
  fallbackOnBody: true,
  handle: '.move-icon',
  fallbackOnBody: true,
  swapThreshold: 0.65,
}

const createCategoriesSortable = (categories) => {
  const roots = document.querySelectorAll('#categories')
  for (let i = 0; i < roots.length; i++)
    Sortable.create(roots[i], {group: 'category', ...props,
      onEnd: ({oldIndex, newIndex}) => categories(move(categories(), oldIndex, newIndex))})
}

const createElementsSortable = (categories) => {
  const leafs = document.querySelectorAll('.elements')
  for (let i = 0; i < leafs.length; i++)
    Sortable.create(leafs[i], {group: 'element', ...props,
    onEnd: ({oldIndex, newIndex, from, to}) => {
      const _categories = categories()
      if (from.id === to.id) {//moving in category
        _categories.forEach(el => {
          if (el.code===to.id) el.elements = move(el.elements, oldIndex, newIndex)
        })
      } else {//moving between categories
        let item
        _categories.forEach(el => {
          if (el.code===from.id) item = el.elements.splice(oldIndex,1)[0]
        })
        _categories.forEach(el => {
          if (el.code===to.id) el.elements.splice(newIndex,0,item)
        })
      }
      categories(_categories)
    }})
}

const CategoryItem = {
  viewModel: function(params) {
    this.code = params.code
    this.name = params.name
    this.elements = params.elements

    this.isHide = ko.observable(true)
    this.toggle = function() {
      $toggle(this.isHide)
      if (!this.isHide()) createElementsSortable(params.categories)
    }.bind(this)
  },
  template: /*html*/`
    <div class="category">
      <div class="category__body">
        <i class="fa icon circle"
          data-bind="css: {'fa-chevron-down': isHide(), 'fa-chevron-up': !isHide()},
                     click: toggle, attr: {title: isHide() ? 'Показать' : 'Скрыть'}"></i>
        <span data-bind="text: name" class="category__title"></span>
        <i class="fa fa-arrows-v icon move-icon" title="Переместить"></i>
      </div>
      <div data-bind="hidden: isHide">
        <div data-bind="foreach: elements, attr: {id: code}" class="elements" style="margin-top: -3px">
          <div class="element">
            <span data-bind="text: elName" class="element__title"></span>
            <i class="fa fa-arrows-v icon move-icon" title="Переместить"></i>
          </div>
        </div>
      </div>
    </div>
  `
}