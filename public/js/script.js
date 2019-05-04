// Pagination functionality

const books = document.querySelectorAll('tbody tr');
const numberOfBooks = books.length;
const paginationDiv = document.querySelector('.paginationDiv');
const paginationList = document.createElement('ul');

//function to show 10 books at a time
function showBooks(list, page) {

    for (let i=0 ; i < list.length; i++){
      let index = i;
      let book = list[i];
      let minIndex = page * 10 - 10;
      let maxIndex = page * 10 - 1;
      if(index <= maxIndex && index >= minIndex){
        book.style.display = "";
      } else {
        book.style.display = "none";
      }
    };
  };

// determine number of pages needed
const numPages = Math.ceil(books.length/10);

//function to Append Page Links
function appendPageLinks(list) {
    const pagination = document.querySelector('.pagination ul');
    if (pagination) {
        pagination.removeChild('ul');
    };
    for(i = 1; i <= numPages; i++){
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'button';
        a.textContent = i + ' ';
        a.addEventListener('click', (e) => {
            showBooks(list, e.target.text);
            
        });
        li.appendChild(a);
        paginationList.appendChild(li);
        paginationDiv.appendChild(paginationList);
    }
}
//loop through and create/append list items and links
appendPageLinks(books);
showBooks(books, 1);