/**
 * Utils class includes collection of methods that are re-reused in the project 
 */
class apiTestUtils {

    constructor(apiContext) {
       this.apiContext = apiContext;
    }
 
    /**
     * Creates a new ToDo item for given description 
     */
    async createItem(itemDescription) {
       const todoPayload = {
          description: itemDescription
       };
       const createItemResponse = await this.apiContext.post("http://localhost:3002/api/todoItems", {
          data: todoPayload,
          headers: {
             'Content-Type': 'application/json'
          }
       });
       return createItemResponse;
    }
 
    /**
     * Rerieves a ToDo item for the given id 
     */
    async retrieveItemById(id) {
        console.log("good"); 
       const getItemResponse = await this.apiContext.get("http://localhost:3002/api/todoItems/" + id.toString());
       return getItemResponse;
    }
 
    /**
     * Retrieve all ToDo items that aren't marked as completed
     */
    async retrieveAllItems() {
       const getItemListResponse = await this.apiContext.get("http://localhost:3002/api/todoItems/");
       return getItemListResponse;
    }
 
    /**
     * Updates a ToDo item for the given ID and payload
     */
    async updateItem(id, updatePayload) {
       const updateItemResponse = await this.apiContext.put("http://localhost:3002/api/todoItems/" + id.toString(), {
          data: updatePayload,
          headers: {
             'Content-Type': 'application/json'
          }
       });
       return updateItemResponse;
    }
 
    /**
     * Finds that ToDo item for given Id from the list of items and returns the ToDo item  
     */
    async findItemFromList(getItemListResponse, itemId) {
       let itemObject = {};
       const getItemListResponseJason = await getItemListResponse.json();
 
       for (let i = 0; i < await getItemListResponseJason.length; i++) {
          if (getItemListResponseJason[i].id.includes(itemId.toString())) {
             itemObject.itemId = getItemListResponseJason[i].id;
             itemObject.itemDescription = getItemListResponseJason[i].description;
             itemObject.itemisCompleted = getItemListResponseJason[i].itemisCompleted;
             break;
          }
       }
       return itemObject;
    }
 
    /**
     * Creates unique randomized description  
     */
    async createRandomizeDescription() {
       let randomDescription = (Math.trunc(Date.now() + (Math.random() + 1))).toString();
       return randomDescription;
    }
 }
 
 module.exports = {
    apiTestUtils
 }; //Make this class globally visible to all the files in the project