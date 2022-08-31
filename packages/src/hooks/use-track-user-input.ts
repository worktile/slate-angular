import { useRef } from "../utils/react-workaround";
import { AngularEditor } from "../plugins/angular-editor";

export function useTrackUserInput(editor: AngularEditor) {
  const receivedUserInput = useRef<boolean>(false);
  const animationFrameIdRef = useRef<number>(0);

  const onUserInput = () => {
    if (receivedUserInput.current) {
      return;
    }

    receivedUserInput.current = true;

    const window = AngularEditor.getWindow(editor);
    window.cancelAnimationFrame(animationFrameIdRef.current);

    animationFrameIdRef.current = window.requestAnimationFrame(() => {
      receivedUserInput.current = false;
    });
  };

  return {
    receivedUserInput,
    onUserInput
  };
}
