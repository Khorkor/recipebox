var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

console.clear();
var Component = React.Component;
var itemName = 'recipeBox_recipes';

var DEFAULT_RECIPES = {
  "1": {
    "id": 1,
    "name": "Pumpkin Pie",
    "ingredients": ["Pumpkin Puree", "Sweetened Condensed Milk", "Eggs", "Pumpkin Pie Spice", "Pie Crust"]
  },
  "2": {
    "id": 2,
    "name": "Spaghetti",
    "ingredients": ["Noodles", "Tomato Sauce", "(Optional) Meatballs"]
  },
  "3": {
    "id": 3,
    "name": "Onion Pie",
    "ingredients": ["Onion", "Pie Crust", "Chicken Soup Stock"]
  }
};

var App = function (_Component) {
  _inherits(App, _Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    var recipes = [];

    var recipeData = {};
    if (localStorage.getItem(itemName)) {
      recipeData = JSON.parse(localStorage.getItem(itemName));
    } else {
      localStorage.setItem(itemName, JSON.stringify(DEFAULT_RECIPES));
      recipeData = DEFAULT_RECIPES;
    }

    _this.state = {
      recipes: recipeData,
      activeRecipe: null,
      warningAction: { name: '', description: '', function: null }
    };

    _this.onClickRecipe = _this.onClickRecipe.bind(_this);
    _this.onUpdateRecipe = _this.onUpdateRecipe.bind(_this);
    _this.onReset = _this.onReset.bind(_this);
    _this.resetRecipes = _this.resetRecipes.bind(_this);
    _this.addRecipe = _this.addRecipe.bind(_this);
    _this.onDeleteRecipe = _this.onDeleteRecipe.bind(_this);
    _this.deleteRecipe = _this.deleteRecipe.bind(_this);
    return _this;
  }

  _createClass(App, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      localStorage.setItem(itemName, JSON.stringify(this.state.recipes));
    }
  }, {
    key: "onClickRecipe",
    value: function onClickRecipe(e) {
      var id = e.currentTarget.dataset.id;
      if (e.target.nodeName == 'H2' && this.state.activeRecipe == id) {
        this.setState({ activeRecipe: null });
      } else {
        this.setState({ activeRecipe: e.currentTarget.dataset.id });
      }
    }
  }, {
    key: "onUpdateRecipe",
    value: function onUpdateRecipe(e) {
      e.preventDefault();
      var id = this.state.activeRecipe;
      var currentRecipe = this.state.recipes[id];
      var action = e.currentTarget.dataset.action;

      var name = currentRecipe.name;
      var ingredients = currentRecipe.ingredients.slice();

      switch (action) {
        case 'updateName':
          name = e.target.value;
          break;
        case 'deleteIngredient':
          ingredients.splice(e.currentTarget.dataset.index, 1);
          break;
        case 'addIngredient':
          var ingredient = e.currentTarget.querySelector('input');
          if (ingredient.value.match(/^\s*$/) == null) {
            ingredients.push(ingredient.value);
            ingredient.value = '';
          }
          break;
        default:
          break;
      }

      var newRecipe = Object.assign({}, this.state.recipes[id], { name: name, ingredients: ingredients });
      var recipes = Object.assign({}, this.state.recipes, _defineProperty({}, id, newRecipe));
      this.setState({ recipes: recipes });
    }
  }, {
    key: "onReset",
    value: function onReset(e) {
      var warningAction = {
        name: 'Reset Recipes',
        description: 'reset all recipes to the original defaults and destroy any changes or additions',
        function: this.resetRecipes
      };
      this.setState({ warningAction: warningAction });

      $('#WarningModal').modal('show');
    }
  }, {
    key: "resetRecipes",
    value: function resetRecipes() {
      localStorage.setItem(itemName, JSON.stringify(DEFAULT_RECIPES));
      this.setState({ activeRecipe: null, recipes: DEFAULT_RECIPES });
    }
  }, {
    key: "onDeleteRecipe",
    value: function onDeleteRecipe(e) {
      var id = e.currentTarget.dataset.id;
      var recipeName = this.state.recipes[id].name;
      var warningAction = {
        name: "Delete " + recipeName,
        description: "delete the recipe for " + recipeName,
        function: this.deleteRecipe.bind(null, id)
      };
      this.setState({ warningAction: warningAction });

      $('#WarningModal').modal('show');
    }
  }, {
    key: "deleteRecipe",
    value: function deleteRecipe(id) {
      var recipes = Object.assign({}, this.state.recipes);
      delete recipes[id];
      this.setState({ recipes: recipes });
    }
  }, {
    key: "addRecipe",
    value: function addRecipe() {
      var recipeIds = Object.keys(this.state.recipes);

      var id = recipeIds.reduce(function (acc, val) {
        var intVal = parseInt(val);
        if (intVal >= acc) acc = intVal + 1;
        return acc;
      }, 0);

      var name = '';
      var ingredients = [];

      var newRecipe = _defineProperty({}, id, { id: id, name: name, ingredients: ingredients });
      var recipes = Object.assign({}, this.state.recipes, newRecipe);
      this.setState({ activeRecipe: id, recipes: recipes });
    }
  }, {
    key: "renderRecipes",
    value: function renderRecipes() {
      var recipeList = [];
      var recipes = this.state.recipes;

      for (var key in recipes) {
        var active = this.state.activeRecipe == key;
        recipeList.push(React.createElement(Recipe, {
          onUpdateRecipe: this.onUpdateRecipe,
          onClick: this.onClickRecipe,
          active: active,
          recipe: recipes[key],
          onDelete: this.onDeleteRecipe
        }));
      }

      return recipeList;
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "container-fluid clearfix" },
        React.createElement(
          "h1",
          null,
          "Recipe Box"
        ),
        this.renderRecipes(),
        React.createElement(
          "button",
          {
            type: "button",
            className: "btn btn-success",
            title: "Add a New Recipe",
            onClick: this.addRecipe
          },
          React.createElement("i", { className: "fa fa-plus" }),
          "New Recipe"
        ),
        React.createElement(
          "button",
          {
            type: "button",
            className: "btn btn-warning float-right",
            title: "Reset All Recipes",
            onClick: this.onReset
          },
          React.createElement("i", { className: "fa fa-trash-o" }),
          "Reset Recipes"
        ),
        React.createElement(WarningModal, { action: this.state.warningAction })
      );
    }
  }]);

  return App;
}(Component);

/* components/Recipe.jsx */


var Recipe = function (_Component2) {
  _inherits(Recipe, _Component2);

  function Recipe(props) {
    _classCallCheck(this, Recipe);

    var _this2 = _possibleConstructorReturn(this, (Recipe.__proto__ || Object.getPrototypeOf(Recipe)).call(this, props));

    _this2.onClickEdit = _this2.onClickEdit.bind(_this2);
    _this2.onSubmit = _this2.onSubmit.bind(_this2);
    _this2.renderIngredients = _this2.renderIngredients.bind(_this2);
    _this2.cardTitle = _this2.cardTitle.bind(_this2);
    return _this2;
  }

  _createClass(Recipe, [{
    key: "cardTitle",
    value: function cardTitle() {
      if (this.props.recipe.name) {
        return this.props.recipe.name;
      } else {
        return React.createElement(
          "i",
          { className: "noname text-muted" },
          "recipe #" + this.props.recipe.id
        );
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      // If the name of the recipe isn't set, show and focus the edit field
      if (this.props.active && !this.props.recipe.name.length) {
        var header = document.querySelector('.recipe.active header');
        var input = header.querySelector('.recipeName');
        header.classList.add('edit');
        input.focus();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var recipe = this.props.recipe;
      var active = this.props.active;

      return React.createElement(
        "div",
        {
          className: "recipe card " + (active ? 'active' : ''),
          "data-id": recipe.id,
          onClick: this.props.onClick
        },
        React.createElement(
          "div",
          { className: "card-block" },
          React.createElement(
            "header",
            null,
            React.createElement(
              "h2",
              { className: "card-title" },
              this.cardTitle()
            ),
            React.createElement(
              "form",
              {
                onSubmit: this.onSubmit,
                onChange: this.props.onUpdateRecipe,
                "data-action": "updateName"
              },
              React.createElement("input", {
                className: "form-control recipeName",
                type: "text",
                value: recipe.name,
                tabIndex: "1",
                onBlur: this.onSubmit
              })
            ),
            React.createElement(
              "div",
              { className: "btn-group" },
              React.createElement(
                "button",
                {
                  onClick: this.onClickEdit,
                  className: "btn btn-primary",
                  title: "Edit the Name",
                  type: "button",
                  tabIndex: "0"
                },
                React.createElement("i", { className: "fa fa-pencil" })
              ),
              React.createElement(
                "button",
                {
                  className: "btn btn-danger",
                  "data-id": recipe.id,
                  title: "Delete This Recipe",
                  type: "button",
                  tabIndex: "0",
                  onClick: this.props.onDelete
                },
                React.createElement("i", { className: "fa fa-times" })
              )
            )
          ),
          React.createElement(
            "div",
            { className: "ingredients" },
            React.createElement(
              "h3",
              { className: "card-subtitle text-muted" },
              "Ingredients:"
            ),
            this.renderIngredients()
          )
        ),
        React.createElement("newRecipeModal", null)
      );
    }
  }, {
    key: "onClickEdit",
    value: function onClickEdit(e) {
      var id = this.props.recipe.id;
      var header = document.querySelector(".recipe[data-id=\"" + id + "\"] header");
      var input = header.querySelector('input');
      header.classList.add('edit');
      input.focus();
    }
  }, {
    key: "onSubmit",
    value: function onSubmit(e) {
      e.preventDefault();
      var id = this.props.recipe.id;
      var header = document.querySelector(".recipe[data-id=\"" + id + "\"] header");
      header.classList.remove('edit');
    }
  }, {
    key: "renderIngredients",
    value: function renderIngredients() {
      var _this3 = this;

      var ingredients = this.props.recipe.ingredients;
      var ingredientList = ingredients.map(function (ingredient, i) {
        return React.createElement(
          "li",
          { className: "list-group-item" },
          ingredient,
          React.createElement(
            "button",
            {
              "data-index": i,
              className: "btn btn-danger",
              onClick: _this3.props.onUpdateRecipe,
              "data-action": "deleteIngredient",
              title: "Delete This Ingredient",
              type: "button"
            },
            React.createElement("i", { className: "fa fa-times" })
          )
        );
      });

      return React.createElement(
        "ul",
        { className: "list-group" },
        ingredientList,
        React.createElement(
          "li",
          { className: "list-group-item" },
          React.createElement(
            "form",
            {
              "data-action": "addIngredient",
              onSubmit: this.props.onUpdateRecipe
            },
            React.createElement(
              "div",
              { className: "input-group" },
              React.createElement("input", {
                type: "text",
                className: "form-control",
                placeholder: "Add an ingredient",
                tabIndex: "1"
              }),
              React.createElement(
                "span",
                { className: "input-group-btn" },
                React.createElement(
                  "button",
                  {
                    type: "submit",
                    className: "btn btn-primary",
                    title: "Add This Ingredient"
                  },
                  React.createElement("i", { className: "fa fa-plus" })
                )
              )
            )
          )
        )
      );
    }
  }]);

  return Recipe;
}(Component);

/* components/WarningModal.jsx */


var WarningModal = function (_Component3) {
  _inherits(WarningModal, _Component3);

  function WarningModal() {
    _classCallCheck(this, WarningModal);

    return _possibleConstructorReturn(this, (WarningModal.__proto__ || Object.getPrototypeOf(WarningModal)).apply(this, arguments));
  }

  _createClass(WarningModal, [{
    key: "render",
    value: function render() {
      var action = this.props.action;
      return React.createElement(
        "div",
        {
          className: "modal fade",
          id: "WarningModal",
          tabIndex: "-1",
          role: "dialog",
          "aria-hidden": "true"
        },
        React.createElement(
          "div",
          { className: "modal-dialog", role: "document" },
          React.createElement(
            "div",
            { className: "modal-content" },
            React.createElement(
              "div",
              { className: "modal-header" },
              React.createElement(
                "h2",
                { className: "modal-title" },
                action.name,
                "?"
              ),
              React.createElement(
                "button",
                { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
                React.createElement("i", { className: "fa fa-times", "aria-hidden": "true" })
              )
            ),
            React.createElement(
              "div",
              { className: "modal-body" },
              "Are you sure you want to ",
              action.description,
              "?"
            ),
            React.createElement(
              "div",
              { className: "modal-footer" },
              React.createElement(
                "button",
                {
                  type: "button",
                  className: "btn btn-secondary",
                  "data-dismiss": "modal"
                },
                "Cancel"
              ),
              React.createElement(
                "button",
                {
                  type: "button",
                  className: "btn btn-danger",
                  "data-dismiss": "modal",
                  onClick: action.function
                },
                "Okay"
              )
            )
          )
        )
      );
    }
  }]);

  return WarningModal;
}(Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));