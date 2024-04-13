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

const createCategoriesSortable = () => {
  const roots = document.querySelectorAll('#categories')
  for (let i = 0; i < roots.length; i++)
    Sortable.create(roots[i], {group: 'category', ...props, onEnd: e => console.log({o: e.oldIndex, n: e.newIndex}) })
}

const createElementsSortable = () => {
  const leafs = document.querySelectorAll('.elements')
  for (let i = 0; i < leafs.length; i++)
    Sortable.create(leafs[i], {group: 'element', ...props, onEnd: e => console.log({o: e.oldIndex, n: e.newIndex, t: e.to, f: e.from})})
}

const CategoryItem = {
  viewModel: function(params) {
    this.name = params.name
    this.elements = params.elements

    this.isHide = ko.observable(true)
    this.toggle = function() {
      $toggle(this.isHide)
      if (!this.isHide()) createElementsSortable()
    }.bind(this)
  },
  template: /*html*/`
    <div class="category">
      <div class="category__body">
        <i class="fa icon circle"
          data-bind="css: {'fa-chevron-down': isHide(), 'fa-chevron-up': !isHide()},
                    click: toggle, attr: {title: isHide() ? 'Показать' : 'Скрыть'}"></i>
        <span data-bind="text: name" class="category__title"></span>
        <i class="fa fa-arrows-v icon move-icon" data-bind="attr: {title: 'Переместить'}"></i>
      </div>
      <div data-bind="visible: !isHide()">
        <div data-bind="foreach: elements" class="elements" style="margin-top: -3px">
          <div class="element">
            <span data-bind="text: elName" class="element__title"></span>
            <i class="fa fa-arrows-v icon move-icon" data-bind="attr: {title: 'Переместить'}"></i>
          </div>
        </div>
      </div>
    </div>
  `,
  //synchronous: true
}