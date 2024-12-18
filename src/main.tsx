import './createPost.js';

import { Devvit, useState } from '@devvit/public-api';
import {Columns} from '@devvit/kit'

// Defines the messages that are exchanged between Devvit and Web View
var topTen: { points: number; user: string }[] = [{points:0, user:'user'}];

type WebViewMessage =
  | /*{
      type: 'initialData';
      data: { username: string; currentCounter: number; score: number;};
    }
  | {
      type: 'setCounter';
      data: { newCounter: number };
    }
  | {
      type: 'updateCounter';
      data: { currentCounter: number };
    }*/
    {
      type: 'leaderboard';
      data: { member: string; score: number; };
    }
    | {
      type: 'setScore';
      data: { newScore: number };
    }
  | {
      type: 'updateScore';
      data: { currentScore: number };
    }
    
    ;

Devvit.configure({
  redditAPI: true,
  redis: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'Rootle - Daily Etymology Puzzle',
  height: 'tall',
  render: (context) => {
    // Load username with `useAsync` hook
    const [member] = useState(async () => {
      const currUser = await context.reddit.getCurrentUser();
      return currUser?.username ?? 'anon';
    });
    createLeaderboard(context);

    // Load latest counter from redis with `useAsync` hook
   /* const [counter, setCounter] = useState(async () => {
      const redisCount = await context.redis.get(`counter_${context.postId}`);
      return Number(redisCount ?? 0);
    });*/
    const [score, setScore] = useState(async () => {
      const redisScore = await context.redis.zScore('leaderboard2', member);
      return Number(redisScore ?? 0);});
    
    const [rank,setRank] = useState(async () => {
      const redisRank = await context.redis.zRank('leaderboard2', member);
      return Number(redisRank ?? 0);});
    // Create a reactive state for web view visibility
    const [webviewVisible, setWebviewVisible] = useState(false);

    // When the web view invokes `window.parent.postMessage` this function is called
    // MESSAGING FROM WEBVIEW TO DEVVIT
    const onMessage = async (msg: WebViewMessage) => {
      switch (msg.type) {
        /*case 'setCounter':
          await context.redis.set(`counter_${context.postId}`, msg.data.newCounter.toString());
          context.ui.webView.postMessage('myWebView', {
            type: 'updateCounter',
            data: {
              currentCounter: msg.data.newCounter,
            },
          });
          setCounter(msg.data.newCounter);
          break;*/
          case 'setScore':
            //await context.redis.set(`score_${context.postId}`, msg.data.newScore.toString());
            //setScore(msg.data.newScore);
            await context.redis.zAdd('leaderboard2', {member: member, score:msg.data.newScore});
            break;
          case 'leaderboard':
          case 'updateScore':
            break;
        /*case 'initialData':
        case 'updateCounter':
          break;
*/
        default:
          throw new Error(`Unknown message type: ${msg satisfies never}`);
      }
    };

    // When the button is clicked, send initial data to web view and show it
    // send the member and their score
    const onShowWebviewClick = () => {
      setWebviewVisible(true);
      /*context.ui.webView.postMessage('myWebView', {
        type: 'initialData',
        data: {
          username: username,
          score: 0,
        }*/
        
      context.ui.webView.postMessage('myWebView', {
        type: 'leaderboard',
        data: {
          member: member,
          score: score,
        }
        ,
      });
    };

    // Render the custom post type
    return (
      <vstack grow padding="small">
        <vstack
          grow={!webviewVisible}
          height={webviewVisible ? '0%' : '100%'}
          alignment="middle center"
        >
          {/* <spacer /> */}
          <vstack alignment="center">
            {/* top of the page displaying user's score and rank */}
            <hstack>
              <text size="xxlarge" weight="bold">
                {' '}
                {member ?? ''}
              </text>
              <text size="xxlarge">'s Score: </text>
              <text size="xxlarge" weight="bold">
                {' '}
                {score ?? 0}
              </text>
              <spacer />
              <spacer />
            </hstack>
            {/* leaderboard */}
            <hstack>
              <text size="xxlarge">ROOTLE LEADERBOARD</text>
            </hstack>
            <vstack padding="medium">
                <Columns columnCount={2} gapX="5px" gapY="10px" order="column">
                {topTen.map((participant, index) => {
            return (
              <hstack border="thin" alignment="start middle" height="30px" width="300px">
                <text>{index + 1}</text>
                <text>: u/</text>
                <text>{participant.user}</text>
                <text> - </text>
                <text>{participant.points}</text>
              </hstack>
            );
          }) ?? 0}
                </Columns>
            </vstack>

            <hstack>
              <text size="large">Guess the word of the day.</text>
            </hstack>
            <hstack>
              <text size="medium">Hints about the prefix, root, and suffix origins appear after each guess.</text>
            </hstack>
          </vstack>
          <spacer />
          <button onPress={onShowWebviewClick}>Play today's Rootle puzzle!</button>
        </vstack>
        <vstack grow={webviewVisible} height={webviewVisible ? '100%' : '0%'}>
          <vstack border="thick" borderColor="black" height={webviewVisible ? '100%' : '0%'}>
            <webview
              id="myWebView"
              url="page.html"
              onMessage={(msg) => onMessage(msg as WebViewMessage)}
              grow
              height={webviewVisible ? '100%' : '0%'}
            />
          </vstack>
        </vstack>
      </vstack>
    );
  },
});

async function createLeaderboard(context: Devvit.Context) {
  //sample data
  await context.redis.zAdd(
    'leaderboard2',
    { member: 'louis', score: 37 },
    { member: 'fernando', score: 10 },
    { member: 'caesar', score: 20 },
    { member: 'alexander', score: 25 },
    { member: 'bernie', score: 0 },
    { member: 'hilton', score: 0 },
    { member: 'precious', score: 0 },
    { member: 'changelog', score: 3 },
    { member: 'scotland', score: 0 },
    { member: 'thanks', score: 2 },
    { member: 'picasso', score: 0 },
  );

  //get last 5 
  var data = await context.redis.zScan('leaderboard2', 0);
  var mems = data.members;
  topTen = mems.slice(-10).reverse() 
  .map(member => ({
    points: member.score,
    user: member.member,  
  }));

}

export default Devvit;
