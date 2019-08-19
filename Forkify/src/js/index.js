// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import * as listView from './views/listView'
import * as likesView from './views/likesView'
import Likes from './models/Likes';


/**  Global state object of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {}

/**Search Controller
 * 
 */
const controlSearch = async () => {

    // Get query from view
    const query = searchView.getInput() //TODO
    //create new search object and add to state
    query ? state.search = new Search(query) : console.log("Query is empty");

    //Prepare UI for results
    searchView.clearResults();
    searchView.clearInput();
    renderLoader(elements.searchRes)

    try {
        //Search for recipes
        await state.search.getResults();
        clearLoader();
        // Render results on UI
        searchView.renderResults(state.search.result)
    } catch (error) {
        alert('Something wrong with the search')
        clearLoader();
    }

}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    if (btn) {
        const gotoPage = ParseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, gotoPage)
    }
})


/** RECIPE CONTROLLER */
const controlRecipe = async () => {
    //Get ID from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        //Prep UI for changes
        recipeView.clearRecipe()
        renderLoader(elements.recipe)

        //Highlightselected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);
        try {
            // get recipe data
            await state.recipe.getRecipe()
            state.recipe.parseIngredients();
            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            //Render recipe
            clearLoader()
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id))
        } catch (e) {
            alert(e)
        }

    }
}

window.addEventListener('load', () => {
    state.likes = new Likes()
    state.likes.readStorage()
    likesView.toggleLikesMenu(state.likes.getNumLikes())

    state.likes.likes.forEach(like => likesView.renderLike(like))
});

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe))

/** LIST CONTROLLER */

const controlList = () => {
    if (!state.list) state.list = new List();
    //Add each Ingrdient to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(...Object.values(el))
        listView.renderItem(item)
    });

}

/** LIKE CONTROLLER */

const controlLike = () => {
    if(!state.likes) state.likes = new Likes()
    const currentID = state.recipe.id;
    // User has not yet liked current recipe
    if(!state.likes.isLiked(currentID)) {
        //Add like to the state
        const newLike = state.likes.addLike(currentID,state.recipe.title,state.recipe.author, state.recipe.img)
        //Toggle the like button 
        likesView.toggleLikeBtn(true);
        //Add like to UI list
        likesView.renderLike(newLike);
    // User HAS liked the current recipe   
    } else {
        state.likes.deleteLike(currentID)
        likesView.toggleLikeBtn(false);
        likesView.deleteLike(currentID)
    }

    likesView.toggleLikesMenu(state.likes.getNumLikes())
}

//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id)
        listView.deleteItem(id)
    } else if(e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value,10);
        state.list.updateCount(id, val);
    }
})



elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec')
            recipeView.updateServingsIngredients(state.recipe)
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredients(state.recipe)
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList()
    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        //Like Controller
        controlLike()
    }
})

