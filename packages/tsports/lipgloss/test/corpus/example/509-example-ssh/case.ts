import {
  BorderStyles,
  Center,
  Colors,
  Height,
  HorizontalAlignment,
  NewRenderer,
  NewStyle,
  newList,
  newTable,
  Place,
  VerticalAlignment,
} from '../../../../src/index.js';

// Set color profile for consistent output

// This example demonstrates how to use a custom Lip Gloss renderer with Wish,
// a package for building custom SSH servers.
//
// The big advantage to using custom renderers here is that we can accurately
// detect the background color and color profile for each client and render
// against that accordingly.
//
// For details on wish see: https://github.com/charmbracelet/wish/

// Available styles.
interface Styles {
  bold: any;
  faint: any;
  italic: any;
  underline: any;
  strikethrough: any;
  red: any;
  green: any;
  yellow: any;
  blue: any;
  magenta: any;
  cyan: any;
  gray: any;
}

// Create new styles against a given renderer.
function makeStyles(r: any): Styles {
  return {
    bold: NewStyle().bold(true),
    faint: NewStyle().faint(true),
    italic: NewStyle().italic(true),
    underline: NewStyle().underline(true),
    strikethrough: NewStyle().strikethrough(true),
    red: NewStyle().color('#E88388'),
    green: NewStyle().color('#A8CC8C'),
    yellow: NewStyle().color('#DBAB79'),
    blue: NewStyle().color('#71BEF2'),
    magenta: NewStyle().color('#D290E4'),
    cyan: NewStyle().color('#66C2CD'),
    gray: NewStyle().color('#B9BFCA'),
  };
}

// Bridge Wish and Termenv so we can query for a user's terminal capabilities.
interface SshOutput {
  session: any;
  tty: any;
}

// TypeScript equivalent methods would be:
// write(p: Uint8Array): Promise<number>
// read(p: Uint8Array): Promise<number>
// fd(): number

interface SshEnviron {
  environ: string[];
}

// TypeScript equivalent methods:
// getenv(key: string): string
// environ(): string[]

// Create a termenv.Output from the session.
function outputFromSession(sess: any): any {
  const sshPty = sess.Pty();
  const tty = {}; // pty.Open() equivalent

  const o = {
    session: sess,
    tty: tty,
  };
  let environ = sess.Environ();
  environ = [...environ, `TERM=${sshPty.Term}`];
  const e = { environ: environ };
  // We need to use unsafe mode here because the ssh session is not running
  // locally and we already know that the session is a TTY.
  return {}; // termenv.NewOutput equivalent
}

// Handle SSH requests.
function handler(next: any): any {
  return (sess: any) => {
    // Get client's output.
    const clientOutput = outputFromSession(sess);

    const [ptyInfo, , active] = sess.Pty();
    if (!active) {
      next(sess);
      return;
    }
    const width = ptyInfo.Window.Width;

    // Initialize new renderer for the client.
    const renderer = NewRenderer();
    renderer.setOutput(clientOutput);

    // Initialize new styles against the renderer.
    const styles = makeStyles(renderer);

    let str = '';

    str += `\n\n${styles.bold} ${styles.faint} ${styles.italic} ${styles.underline} ${styles.strikethrough}`;

    str += `\n${styles.red} ${styles.green} ${styles.yellow} ${styles.blue} ${styles.magenta} ${styles.cyan} ${styles.gray}`;

    str += `\n${styles.red} ${styles.green} ${styles.yellow} ${styles.blue} ${styles.magenta} ${styles.cyan} ${styles.gray}\n\n`;

    str += `${styles.bold.render('Has dark background?')} ${renderer.hasDarkBackground()} ${renderer.output().backgroundColor()}\n\n`;

    const block = Place(
      width,
      Height(str),
      Center,
      Center,
      str,
      {
        chars: '/',
        foreground: '250' // Using light color for now
      }
    );

    // Render to client.
    // wish.WriteString(sess, block);

    next(sess);
  };
}

const port = 3456;
// TypeScript SSH server setup would be different:
// const server = createSSHServer({
//   address: `:${port}`,
//   hostKeyPath: "ssh_example",
//   middleware: [handler, lm.Middleware()]
// });
// console.log(`SSH server listening on port ${port}`);
// console.log(`To connect from your local machine run: ssh localhost -p ${port}`);
// server.listen();
