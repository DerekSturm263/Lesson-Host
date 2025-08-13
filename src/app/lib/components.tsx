export function Header({ title, doBackButton, doLanguageSwitcher }: { title: string, doBackButton: boolean, doLanguageSwitcher: boolean }) {
  return (
    <div className="">
      <h3 className="text-center">
        {title}
      </h3>

      <select name="selectLanguage" id="selectLanguage">
        <option value="en">English</option>
        <option value="nl">Dutch</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="hi">Hindi</option>
        <option value="it">Italian</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
        <option value="pl">Polish</option>
        <option value="ru">Russian</option>
        <option value="es">Spanish</option>
        <option value="sv">Swedish</option>
      </select>
    </div>
  );
}

type SidebarContent = {
  label: string,
  action: () => void
};

export function Sidebar({ label, content, doHamburgerButton }: { label: string, content: SidebarContent[], doHamburgerButton: boolean }) {
  return (
    <div className="">
      <h3 className="text-center">
        {label}
      </h3>

      <ul className="">
        {content.map((item, index) => (
          <li key={index} className="">
            <button onClick={item.action} className="">
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
