import '../styles/header.css';

function Header() {

  return (

    <div class="header-bar">
      <div class="title">
        <h2> FLASHCARD WEBSITE </h2>
      </div>
      
      <div class="edit">
        <a href="/">
          <button>EDIT PAGE</button>
        </a>
      </div>
      
      <div class="library">
        <a href="/library">
          <button>VIEW PAGE</button>
        </a>
      </div>
    </div>
  )
}

export default Header;