

export class Controller{
    constructor(data){
        this.data = data;
        console.log("hyyy");
       
    }

    categories(data){
            const list = data.map((item) =>{
              return item.type;
            })
            const  uniqueList = [...new Set(list)]; 
            return uniqueList;
    }

    filterItems(categoryName) {
      return this.data.filter(item => item.type === categoryName);
  }
  dataOfSearchedItems(searchTerm) {
    console.log(searchTerm,"--------------------------------------")
    const searchedThing = this.data.filter((item)=>{
    return item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());
  });
  return searchedThing;
  }
}