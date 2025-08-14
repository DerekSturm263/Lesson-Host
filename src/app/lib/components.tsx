import { Children } from 'react';
import Markdown from 'react-markdown'
import * as functions from '../lib/functions';
import * as types from '../lib/types';

export function Header({ children, title, doBackButton, doLanguageSwitcher }: { children?: React.ReactNode, title: string, doBackButton: boolean, doLanguageSwitcher: boolean }) {
  return (
    <div className="header">
      <h3>
        {title}
      </h3>

      <ol>
        {Children.map(children, child => 
          <li>
            {child}
          </li>
        )}
      </ol>

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

export function Sidebar({ children, label, doHamburgerButton }: { children?: React.ReactNode, label: string, doHamburgerButton: boolean }) {
  return (
    <div className="sidebar">
      <h3>
        {label}
      </h3>

      <ol>
        {Children.map(children, child => 
          <li>
            {child}
          </li>
        )}
      </ol>
    </div>
  );
}

export function Element({ chapter, element }: { chapter: types.Chapter, element: types.Element }) {
  return (
    <div className="element">
      <Interaction type={element.type} value={element.value} />
      <Text chapter={chapter} element={element} />
    </div>
  );
}

function Interaction({ type, value }: { type: string, value: types.ShortAnswer | types.TrueOrFalse | types.Matching | types.Ordering | types.Files | types.Drawing | types.Graph | types.DAW | types.Codespace | types.Engine | types.IFrame }) {
  switch (type) {
    case 'shortAnswer':
      return (<div className="interaction" data-type="shortAnswer"><ShortAnswer value={value as types.ShortAnswer} /></div>);
    case 'trueOrFalse':
      return (<div className="interaction" data-type="trueOrFalse"><TrueOrFalse value={value as types.TrueOrFalse} /></div>);
    case 'matching':
      return (<div className="interaction" data-type="matching"><Matching value={value as types.Matching} /></div>);
    case 'ordering':
      return (<div className="interaction" data-type="ordering"><Ordering value={value as types.Ordering} /></div>);
    case 'files':
      return (<div className="interaction" data-type="files"><Files value={value as types.Files} /></div>);
    case 'drawing':
      return (<div className="interaction" data-type="drawing"><Drawing value={value as types.Drawing} /></div>);
    case 'graph':
      return (<div className="interaction" data-type="graph"><Graph value={value as types.Graph} /></div>);
    case 'daw':
      return (<div className="interaction" data-type="daw"><DAW value={value as types.DAW} /></div>);
    case 'codespace':
      return (<div className="interaction" data-type="codespace"><Codespace value={value as types.Codespace} /></div>);
    case 'engine':
      return (<div className="interaction" data-type="engine"><Engine value={value as types.Engine} /></div>);
    case 'iFrame':
      return (<div className="interaction" data-type="iFrame"><IFrame value={value as types.IFrame} /></div>);
    default:
      return <div className="interaction" data-type="none"></div>;
  }
}

function ShortAnswer({ value }: { value: types.ShortAnswer } ) {
  return (
    <div
      className="smallInteraction"
    >
      <form
        action={functions.submitShortAnswer}
      >
        <input
          type="text"
          name="response"
          placeholder="Write your response here. Press enter to submit"
          autoComplete="off"
        />
      </form>
    </div>
  );
}

function TrueOrFalse({ value }: { value: types.TrueOrFalse }) {
  return (
    <div
      className="smallInteraction"
    >
      
    </div>
  );
}

function Matching({ value }: { value: types.Matching }) {
  return (
    <div
      className="smallInteraction"
    >
      
    </div>
  );
}

function Ordering({ value }: { value: types.Ordering }) {
  return (
    <div
      className="smallInteraction"
    >
      
    </div>
  );
}

function Files({ value }: { value: types.Files }) {
  return (
    <div
      className="smallInteraction"
    >
      
    </div>
  );
}

function Drawing({ value }: { value: types.Drawing }) {
  return (
    <div
      className="fullscreenInteraction"
    >
      
    </div>
  );
}

function Graph({ value }: { value: types.Graph }) {
  return (
    <div
      className="fullscreenInteraction"
      onLoad={functions.loadGraph}
      data-type={value.type}
      data-filename={value.fileName}
    ></div>
  );
}

function DAW({ value }: { value: types.DAW }) {
  return (
    <div
      className="fullscreenInteraction"
    >
      
    </div>
  );
}

function Codespace({ value }: { value: types.Codespace }) {
  return (
    <iframe
      className="fullscreenInteraction"
      onLoad={functions.loadCodespace}
      src="https://onecompiler.com/embed/${element.value.codespaceLanguage}?availableLanguages=true&hideLanguageSelection=true&hideNew=true&hideNewFileOption=true&hideTitle=true&theme=dark&listenToEvents=true&codeChangeEvent=true"
      data-language={value.language}
      data-files={JSON.stringify(value.files)}
      data-correctoutput={value.correctOutput ?? ''}
    ></iframe>
  );
}

function Engine({ value }: { value: types.Engine }) {
  return (
    <iframe
      className="fullscreenInteraction"
      src="https://editor.godotengine.org/releases/latest/"
    ></iframe>
  );
}

function IFrame({ value }: { value: types.IFrame }) {
  return (
    <iframe
      className="fullscreenInteraction"
      src={value.source}
    ></iframe>
  );
}

function Text({ chapter, element }: { chapter: types.Chapter, element: types.Element }) {
  return (
    <div className="textBox">
      <div
        className="text"
        data-originaltext={element.text}
        data-lastnonthinkingtext={element.text}
      >
        <Markdown>{functions.wordByWordify(element.text)}</Markdown>
      </div>

      <div className="buttons">
        <div className="col1">
          {chapter.elements.map((element, index) => (
            <button
              className="dot"
              onClick={functions.load}
              title={`Load section ${index}`}
              disabled={element.state == types.ElementState.Locked}
              data-iscomplete="false"
              data-isselected="false"
            ></button>
          ))}
        </div>

        <div className="col2">
          <button
            onClick={functions.rephrase}
            title="Rephrase text"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/8369/8369314.png"
              width="25"
              height="25"
            />
            Rephrase
          </button>
          
          <button
            onClick={functions.readAloud}
            title="Read text aloud"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/10629/10629003.png"
              width="25"
              height="25"
            />
            Read Aloud
          </button>

          <button
            onClick={functions.reset}
            title="Reset text and interaction"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2618/2618245.png"
              width="25"
              height="25"
            />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
