import * as elements from '../lib/types';

type Content = {
  label: string,
  action: () => void
};

export function Header({ title, content, doBackButton, doLanguageSwitcher }: { title: string, content: Content[], doBackButton: boolean, doLanguageSwitcher: boolean }) {
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

export function Sidebar({ label, content, doHamburgerButton }: { label: string, content: Content[], doHamburgerButton: boolean }) {
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

export function Element({ element }: { element: elements.Element }) {
  return (
    <div className="">
      <Interaction type={element.type} value={element.value} />
      <Text text={element.text} />
    </div>
  );
}

function Text({ text }: { text: string }) {
  return (
    <div className="">
      <p>{text}</p>
    </div>
  );
}

function Interaction({ type, value }: { type: string, value: elements.ShortAnswer | elements.TrueOrFalse | elements.Matching | elements.Ordering | elements.Files | elements.Drawing | elements.Graph | elements.DAW | elements.Codespace | elements.Engine | elements.IFrame }) {
  switch (type) {
    case 'shortAnswer':
      return (<div className=""><ShortAnswer value={value} /></div>);
    case 'trueOrFalse':
      return (<div className=""><TrueOrFalse value={value} /></div>);
    case 'matching':
      return (<div className=""><Matching value={value} /></div>);
    case 'ordering':
      return (<div className=""><Ordering value={value} /></div>);
    case 'files':
      return (<div className=""><Files value={value} /></div>);
    case 'drawing':
      return (<div className=""><Drawing value={value} /></div>);
    case 'graph':
      return (<div className=""><Graph value={value} /></div>);
    case 'daw':
      return (<div className=""><DAW value={value} /></div>);
    case 'codespace':
      return (<div className=""><Codespace value={value} /></div>);
    case 'engine':
      return (<div className=""><Engine value={value} /></div>);
    case 'iFrame':
      return (<div className=""><IFrame value={value} /></div>);
    default:
      return <div className=""></div>;
  }
}

function ShortAnswer({ value }: { value: elements.ShortAnswer } ) {
  return (

  );
}

function TrueOrFalse({ value }: { value: elements.TrueOrFalse }) {
  return (

  );
}

function Matching({ value }: { value: elements.Matching }) {
  return (

  );
}

function Ordering({ value }: { value: elements.Ordering }) {
  return (

  );
}

function Files({ value }: { value: elements.Files }) {
  return (

  );
}

function Drawing({ value }: { value: elements.Drawing }) {
  return (

  );
}

function Graph({ value }: { value: elements.Graph }) {
  return (

  );
}

function DAW({ value }: { value: elements.DAW }) {
  return (

  );
}

function Codespace({ value }: { value: elements.Codespace }) {
  return (

  );
}

function Engine({ value }: { value: elements.Engine }) {
  return (

  );
}

function IFrame({ value }: { value: elements.IFrame }) {
  return (
    
  );
}
