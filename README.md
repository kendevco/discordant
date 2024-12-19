This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


Intro & Demo
0:00
hey there my name is Antonio and welcome to the newest video on my channel in
0:06
this tutorial I'm going to teach you how to create an amazing Discord clone where users will be able to create their very
0:13
own servers just like this so after the image has been uploaded I'm going to
0:19
click create and there we go just like that I've created my very own code with Antonio Discord clone server in order to
0:27
invite users all I have to do is click on invite people and copy this invite URL now the other user has to paste that
0:35
inside of their browser just like this and in a couple of seconds you're going to see that this user is now part of
0:42
code with Antonio server now let me demonstrate to you how these users can talk in real time inside of
0:50
this General Channel using web sockets so I'm going to write hello there like
0:55
this and this message is immediately transmitted back to me here and also to
1:01
all other users in the general Channel and this users can also answer just like
1:07
this as an admin I can delete any message on the server in real time so once I press
1:13
delete right here and confirm this you can see that now it says this message has been deleted and same is true for
1:20
the other user the owner of the message can also edit the message so instead of
1:26
hello there let's say this is edited like this so I'm going to click save and
1:31
there we go now it says this is edited besides sending text messages users can
1:37
also upload attachments like PDF files and images so I just uploaded my PDF
1:43
file in the upload thing I'm going to click Send and in real time the other user received apdf file and same is true
1:52
for sending an image from unsplash for example once I click upload and upload
1:57
thing does its thing we can go ahead and click Send like this and there we go the
2:03
other user has received this new message right here besides text channels users
2:09
can also communicate in video channels so I'm going to create a new channel and I'm gonna call it daily like this and
2:16
channel type is going to be video I'm going to click create and there we go now the daily Channel exists
2:24
I'm gonna go ahead and join this daily Channel and in a couple of seconds you're gonna see me on the camera all
2:31
alone in this daily channel so I'm gonna go to the other user and I'm gonna join this newly created Channel and there we
2:37
go now there is two of us in this daily uh video channel we can share screen we
2:43
can mute ourselves we can change our camera and we can also chat if needed
2:48
great besides video channels we also have audio channels which are very
2:54
similar but they do not show your camera on by default one cool thing I want to
2:59
show you is how easy it is to leave a video call so just like that I just press on another Channel and there we go
3:06
I'm outside of this video channel here now let's say that I want to find one
3:12
specific Channel or one specific member inside uh of a server which has a lot of
3:19
channels like this so even more than this one cool thing that I can do is I can just go ahead and press a shortcut
3:26
command key and I can search for a specific member and I can initiate a
3:31
one-on-one conversation with this member inside of this channel so I just switched my server right here so I'm
3:37
going to do the same here I'm gonna go back inside of this old server and you can either use the shortcut command key
3:43
or you can press the search button here I'm gonna find the user that I need and there we go now we are inside of our
3:49
one-on-one conversation so you want to say hello this is a private conversation
3:55
inside a different server like this and this message is immediately transmitted
4:02
to the other user and that is not all inside of this individual one-on-one conversation we can also initiate a
4:09
video your call again as you can see now I am alone in this one-on-one conversation but once the other user
4:16
decides to join there we go there's two of us again and once we are done all we have to do is Click End video call right
4:23
here and one more thing I want to show you is how easy it is to manage members
4:29
inside of these applications so I'm gonna go back inside of my code with Antonio right here I'm gonna end the
4:35
video call here as well I'm going back to code with Antonio with the other user and as you can see right now
4:42
I can manage members as an admin so I can either kick this other user or I can give him a moderator badge like this so
4:50
now as you can see it says that this user is a moderator what this means is that this other user
4:57
now has this little Shield icon which when Hubbard says moderator and one more
5:02
thing that this user can now do is same as admin this user can delete other people's messages if he deems them
5:09
inappropriate so an admin sent this image but it doesn't matter since we are on moderator we created a functionality
5:16
where they can create they can delete anyone's message so just like that this message has been deleted alongside
5:22
deleting other people's messages moderators can also create channels so I'm gonna go and create an audio Channel
5:29
like this I'm going to select the type audio and I am going to click create and
5:35
just like that we have a new audio channel right here and as you can see the camera is off by default and the
5:43
person who created this channel as well as the admin and other moderators can always edit the name for example voice
5:50
Channel like this and now it's immediately reflected here and of course they can completely remove the channel
5:57
if it's no longer used and one more thing I want to show you is that this
6:02
application is going to have infinite loading using react 10 stack query so we
6:08
are not going to load all images at once instead when we scroll up you can see
6:13
how they loaded another batch so this way we're going to optimize our application I think this is a really
6:19
really cool project I think it has a bunch of amazing features as you can see
6:24
right here in this corner it says live real-time updates what that means is
6:29
that our websocket server is successfully connected in case it fails we're gonna change this color to Orange
6:35
and it's going to say polling because we're going to have a fallback so even if something goes wrong our users can
6:42
have a great experience on this application and of course besides having dark mode we also have a fully working
6:49
light mode which you already saw from this other user right here so without
6:54
further do let's get started so let's get started and let's configure
Environment setup
7:01
our next 13 application so here on the left side I have my visual studio code
7:06
and I have opened a terminal where I'm going to run my initial commands and
7:11
here on the right side I've prepared the chat cnui documentation so you can
7:17
either go to ui.chatcn.com or you can just Google Chat CN UI so this is going to be the
7:23
component Library which we're going to use alongside our next 13 framework and
7:28
we're going to style the entire application with this beautiful component Library
7:33
so go ahead and head into the documentation right here and select the installation option right here now
7:42
you're prompted to select your framework so I just as I've just mentioned a few times go ahead and select next.js and
7:49
here you have uh simple steps in order to configure that so let's go ahead and
7:54
let's run this First Command together so npx create Dash Max Dash app at latest
8:01
and now what you have to do is give your project a name so for me it's going to be Discord Dash clone like this so npx
8:10
create Dash next Dash app at latest is not tied to chat cnui it's tied to the
8:17
official next 13 documentation but since I want my next 13 to be powered by
8:23
chatsy and design Library that's why I'm following this documentation right here so this is going to set up the latest
8:30
version of next 13 inside of this folder Discord own and once you've done that
8:35
what we have to do is we have to give it some Flags to specify how we want our application to be configured so the
8:42
first thing I want to use is typescript so I'm going to write dash dash typescript like this and dash dash
8:49
tailwind and dash dash s lint like that go ahead and press enter since we are
8:54
using the at latest design for this create Dash next Dash app it's going to check if we have installed the latest
9:01
version of nex13 if we don't it's going to prompt us with this little question
9:06
right here so feel free to just type the Y and enter or just press enter great
9:12
now we have to answer these questions right here so for the source directory I
9:18
am going to select no for the app router I'm going to select yes and make sure you select yes as well to customize the
9:25
import Alias you can leave the no as an answer and just wait for this to be installed
9:32
after this has been installed you're going to see this success message right here and you're gonna see where it
9:38
created your project so I have a project named Discord clone at this location
9:43
right here and all I have to do now is click on open or find any other way to
9:50
find your folder so there we go Discord clone that's the new project that I just created so go ahead and open that if you
9:57
get this prompt you can just press yes I trust the authors like this and there we go now we have the structure of our next
10:04
13 application using the app router so what's important here is that you have
10:10
the app folder right here this was created when we selected the app router option it's important that you have the
10:16
Tailwind config so this is created when we added the dash dash Tailwind instruction and it's important that you
10:23
have the TS config right here that is appended when we added the dash dash
10:28
typescript option great now before we run this project fact I want to run another command in my terminal so make
10:36
sure you've opened this in your Visual Studio code and go back inside of your terminal right here and it should say
10:43
that you are inside of this Discord clone so just make sure that that is true what we have to do now is run the
10:50
second step right here which is running the chat CN CLI or command line
10:55
interface so let's run MPX chat CN Dash UI at latest in it like this so a very
11:02
simple command and now we're going to get prompted with this questions right here which are going to configure our
11:08
new file components.json so it's asking us whether we want to use typescript and
11:14
since we initialized our project with typescript it makes sense that our chat CN components are also using typescript
11:20
so select yes for that for the style I would highly recommend that you keep it to default because
11:26
depending on which style you choose you're gonna have different icons to work with and I'm gonna work with Lucid
11:33
icons which are going to be installed by default if I select this default option
11:38
if you choose New York you're going to have a bit of a different styling you can of course explore that in this chat
11:44
cnui documentation to see how it looks and it's going to look pretty similar
11:49
but you're gonna work with different icons and it's not gonna come with Lucid react installed so I highly recommend
11:55
that you leave it on default and press enter and if you're wondering how I am choosing between this option I'm using
12:02
the arrow keys on my keyboard so make sure you select the default option like this and for this you can pretty much
12:09
choose whatever you want but if you want your project to look as similar to mine
12:14
as possible I recommend you choose the stone option so this is one of the gray
12:20
Tailwind colors right here so slate is gray Grays rating all of this look grayish and have a black color as well
12:28
that stone is the one that fits me best for my Discord project so that's why I'm
12:33
going to select Stone here and press enter and everything here you can just press enter for the global file you can
12:40
press yes for the CSS variables this is the correct location of our Tailwind file you can leave the Alias for
12:46
components you can leave the Alias for utils as well it's asking us whether we
12:52
are using a react server components so the answer for this is yes and that is because we selected the app router when
12:58
we initialized our next 13 so when we use the app router that means that we are going to be working with server
13:04
components so make sure you select yes here as well and now we just have to confirm all of these questions so just
13:11
type y again and there we go it's going to write components.json and it's going to initialize chat CN UI
13:19
and now you see right here that you have a new file components.json right here and just make
13:26
sure that it is well it doesn't have to be exactly the same as mine if you made some configurations but it should be
13:32
pretty similar right here so I'm using react server components I'm using typescript my base color is Stone and
13:38
I'm using CSS variables like this my components Alias is ADD slash components
13:43
and my utils Alias is ADD slash lib Slash use great now that we have that we
13:50
can finally go ahead and run our application so go back inside of your terminal right here
13:57
and just run npm run Dev and your application is going to start at
14:03
localhost 3000 so let's go ahead into this localhost 3000 and let's see what
14:08
we have and there we go yours is probably looking something like this because I am zoomed in so it loaded the
14:15
mobile mode right here great uh so you've successfully set up the next 13
14:20
application and you've successfully set up um this chat CN UI Library so what I
14:26
want to do now is just clean this up a little bit because we don't need all of these things right here so first thing I
14:34
want to do is I want to go inside of my app folder and I want to go inside of globals.css right here so chat cnui and
14:43
the Tailwind configuration flag added this styling for us and we can leave this exactly as it is we don't have to
14:50
delete anything here we're gonna need all of this and one thing I want to add here is a rule for HTML
14:57
body and root like this and give it a height of one hundred percent like this
15:04
great now that we've figured that out let's go ahead and let's close
15:09
everything let's go back inside of our app folder right here and let's go inside of
15:15
page.tsx so page.dsx is what you're seeing right here so this next JS logo
15:20
this getting started this versal logo all of these things and we're not gonna
15:26
need any of that for our initial page so you can go inside of this app page.tsx
15:31
right here and you can remove anything everything inside of this return function right here so I'm going to
15:36
select everything from the start of this main element right here and I'm gonna go all the way to the bottom like this
15:44
and I'm going to remove it and you can replace that with just a small paragraph for example saying hello Discord alone
15:53
like this and there we go we have a small text right here and let's test if our Tailwind is working so we're going
15:59
to use some Tailwind classes here so give this an attribute of class name like this and let's give it a text Dash
16:07
3XL like this there we go now our font is much larger let's try font Dash bold
16:14
like this and let's try text Dash Indigo Dash 500 like this there we go so if
16:22
your colors are working if your bulb font is working and your text size is working you've set up everything
16:27
correctly now one thing I just want to mention to you is you've probably noticed that I have this cool thing
16:34
where when I hover over my classes I can see how they look in pure CSS and I also
16:39
have this cool color indicator and I also have some autocomplete if you're wondering what that is and how do you
16:46
get that you have to go inside of your extensions and type in Tailwind right
16:51
here and just select the first options so it's this Tailwind CSS intellisense and just install that if you want to
16:58
have your classes more readable and have some helpers around the Tailwind great
17:04
you can now remove this import image from next image we're not going to need it here you can leave this home function
17:10
as it is and before we move on to our folder structure for the application one
17:16
thing I want to do is just show you how chat cnui Library works so there is a reason that it shows this Library first
17:23
one is because it's based on tailwind and Radix which work great in server components but the second one is because
17:30
this is a copy and paste component Library so we are only going to add
17:36
components that we are actually using here so what you can do is go inside of your components right here and here in
17:43
this sidebar you're going have every single component available in this project and one we are definitely going
17:49
to need is the button component so let's go ahead and let's add this one immediately so there are many ways you
17:55
can add this to your project you can use the command line interface which is by far the simplest way to do that and I
18:02
would say the correct way to do that especially because of the component.json file which we initialized so this
18:08
command line interface is going to read these components.json file and read our base color read our CSS variables read
18:16
our typescript settings and our react server component settings so it knows how to copy and paste this component
18:23
inside of our application so let's go ahead and I'm going to close everything for
18:29
now I'm going back inside of my terminal here I'm just going to open a new one
18:34
pressing here so now I have two terminals one is running my application and the other one is going to add this
18:40
button so what I have to run is this Command right here npx chats in UI
18:45
latest add button so MPX shutsian Dash UI at latest add button like this and
18:52
let me just expand this so you can see it in one line like this and let's just
18:57
press enter after you've pressed enter you're gonna get prompted to confirm
19:02
this decision just press Y and there we go it is installing just the button so
19:08
nothing else and now you can exit out of this terminal and just leave this one running your application here
19:15
and what you're going to notice now is that inside of your components folder you have a new folder called the UI and
19:22
inside of that you have a button.dsx and this is what you get you have a fully
19:28
customized button component for you following the best practices for following the accessibility methods
19:35
following every single thing that you would need for a high quality button component so this is why I really like
19:41
chat cnui because I have access to every single line of code inside of this
19:47
button I don't have to guess what's working inside I don't have to look inside of my node modules and read types
19:53
everything is written right here if I'm not satisfied by the rounding or by
19:58
padding I can change it manually here to fit to my likings if I don't like the
20:04
variance if I don't want to call it the default but initial nothing is stopping me from renaming this default to initial
20:11
so let me just show you very quickly let's go back inside of our app folder inside of page.dsx right here and what
20:19
I'm going to do is I'm going to wrap this thing in a div like this
20:26
let's just play around with flex so I'm going to give this a class name of flex
20:31
and by default Flex is now in a row order so let's give it a instruction
20:37
Flex Dash call so now it's going to align our items in a column below uh one
20:43
another like this so make sure you save your files in Visual Studio code Visual Studio code does not auto save files
20:49
except if you uh change that settings but by default it doesn't do that what we can do now is we can use that button
20:56
component from add slash components UI button I can see that I have this autocomplete right here so I'm just
21:02
gonna press here like that and I'm gonna right click me like this and there we go
21:08
now we have this beautiful button right here and let me just actually just remove
21:13
this class there we go so I just removed this class because I want to show you how it looks in its normal width not its
21:20
full width inside of full X and I'm going to zoom in just a little bit so that's how easy it was for us to add
21:26
this button which has all the effects needed you can see it has the hover State you can see uh it has the focus
21:32
state so everything we need regarding the accessibility and the fully functioning button great and now we can
21:39
play around and you can give this a variant for example of destructive ghost
21:45
link so if you choose destructive it's going to become red right here you can give it a ghost value like this and now
21:54
you can see how it's well ghostly right and you can also extend it with your own
22:00
class name so VG Indigo 500 for example there we go so you can also do that if
22:05
you need a one-off example that isn't in your variant but one cool thing you can
22:10
do is go by back inside of your components UI button.dsx so to be honest
22:16
you never have to modify anything inside of here but if you really want to play around with it after this link variant
22:22
right here you can feel free to add I don't know test for example BG Dash
22:28
Indigo Dash 500 like this so just like that I created a custom variant for my button and what I can do now is go back
22:35
inside of my page.dsx and look at this now when I try and select my variant
22:41
test is recommended to me because it exists right and if I save there we go I
22:47
just created my very own variant of course we don't need that so I'm just going to remove this test right here and
22:53
leave the link there we go and now you can see I have an error because test no longer exists so that is why I chose to
23:00
use chat cnui is fully customizable we can modify it to any project that's why
23:06
I've been using chatsun UI for both my e-commerce for my Discord clone for
23:13
everything I need right uh great you've successfully set up your next 13 application you've added chat cnui
23:21
you've explored how chat cnui adds your components uh great great job so far and
23:28
before we move on to the folder structure I just want to explain this lab folder right here which was also
23:34
added by chat cnui and inside of these utils you're going to see this CN
23:40
function so this CN function is going to be very useful both inside of chat CN
23:45
components you can see that it uses them uh right here you can see this CN
23:50
library is imported from this file right here but we are also going to use it
23:56
inside of our pages and our custom components so this CN util is a very
24:02
nice util which is going to help us create Dynamic classes inside the Tailwind why do I say that we need a
24:09
util for that why do we need both clsx and Tailwind merge well because there
24:15
are cases where we could create conflicting classes and instead of writing our own complicated util to
24:21
decide which one should be prioritized we have this nice little util which is going to help us and I just want to
24:27
quickly show you how to use that so let's go back to our button here and let's create a variable here constant
24:34
state is equal to True like this and let's give this a class name like this
24:40
and let's open curly brackets and let's import CN from s slash lib utils let's
24:46
go ahead and open this and what you can do here is in the first parameter you can give it a default
24:53
value of let's say BG Dash Indigo Dash 500 so this is like giving a normal
24:59
class name but in the second parameter uh you can do state and end BG red so if
25:07
this variable is true is going to become red so you can see how this overrided
25:13
this so that's why we're using this C in class now this doesn't make too much sense because this state is hard coded
25:19
to be true but think if this was some axios call you know we got something I
25:25
don't know and then we assign that value here and depending on that we want to change our color that's why this is
25:32
useful for those Dynamic cases of course you can remove all of that we're not going to need that just like this so
25:39
just have a plain little button uh great uh I hope uh you understood what we did
25:46
so far you can of course explore your documentation station right here find out a bit more about how chat CN works
25:53
and what we're going to do next is we're gonna go ahead and organize our folders so we can start building our Discord
26:01
clone so what I want to do now is I want to add a specific font uh for my website to
Folders setup
26:08
use and I also want to explore a bit how routing Works in next 13. so let's go
26:14
inside of our app folder inside of layout.dsx right here and let's replace this inter font that our website is
26:21
currently using so I'm going to change this import from next slash Pawn slash Google to not use inter but open
26:28
underscore sense like this and then I'm going to replace this function right here like that there we go and once I
26:34
save you can see that my font has changed slightly and I think it's also fair that we can replace this constant
26:40
inter with font like this and just replace it here as well so font dot
26:46
class name is now using open sense and you can use this metadata to change the
26:52
title of your browser tab so now it says create next app but if I go ahead and
26:58
change it to team chat application it's gonna say team chat application great
27:04
now let's go ahead and let's explore how a routing works so our page.dsx file is
27:10
equivalent to our localhost 3000 so no additional routes in order to create a
27:16
new route you have to create a new folder and let's name this test like this and inside of that in new folder
27:24
create another page.tsx like this and inside I'm going
27:29
to use a code slip at sfc and I'm going to press tab now you probably don't have
27:35
this and you're going to see me type this a lot of times in this project so what that is called is simple react
27:42
Snippets so you can just go ahead and install this simple react Snippets and then you're gonna have the very same
27:48
thing that I have great so now that I added this so sfc I press Tab and I can
27:54
now name this test page like this I'm gonna go ahead inside of this return function and I'm going to write div test
28:02
page like write this so where is this test page visible now well if our page
28:08
that is X is at our root of our website that means that slash test should lead
28:14
to our test page and that is true right here great but one cool thing that you
28:20
can do is you can also create organizational folders so you just notice that every folder we create is
28:26
obviously going to be mapped to a route but what if I just want to create a folder that has no effect on the URL and
28:34
it's purely organizational well for that we can use um organizational folders and the way
28:41
they are written is using brackets like this so I'm just going to go ahead and write out for example so let's let's say
28:50
that this is going to be uh our organizational folder for our sign in register and login routes right and
28:58
inside of that I can go ahead and create a new folder called login for example
29:03
and inside I can create a new file page.tsx like this and I'm going to use
29:09
again my code snippet sfc and name this login page like this and write a div
29:15
login page there we go and now well our URL is currently slash test that's
29:21
because we have this folder test so how do we access this login page well as I
29:27
just mentioned this out inside brackets has no effect on the URL it's purely
29:33
organizational meaning that all I have to do to access the login route is go to slash login so you might be wondering
29:40
well why did I even create this organizational route what's the point why not just use a normal login folder
29:47
in the app folder well if you have a lot of routes in your application it is very useful to organize them in folders like
29:55
this but this organizational folders also have one cool thing you can do you
30:00
can create a custom layout inside so let me show you so I'm going to create a new
30:06
file inside not inside of the login folder but inside of this out folder I'm going to create a new file called layout
30:13
and I'm gonna you're gonna get an error now because there are no exports in this layout that DSX so what I'm gonna do is
30:20
I'm going to write auth layout like this
30:26
like this and go ahead and extract children from the props and make sure you give them a type of children
30:33
react.react node and in the return function all I'm going to do is create a
30:39
div I'm going to render the children like this there we go the error is gone and nothing has changed yet but what I
30:46
can do is I can give it a class name of BG Dash red Dash 500 like this and let's
30:53
give it an H dash full as well and there we go so now if I go back to slash test
30:59
you can see that there is no red background but our login has a red background and you can go ahead and
31:05
create a new folder inside of this out let's call it register for example let's create another page.dsx inside let's
31:13
call it register page and just a div register like this so this is all just mock we're not going to write any login
31:20
functionality right now and now if I go to either slash register or slash login you can see that both of
31:28
them have a red layout so that's a cool thing about this organizational routes
31:33
if you want a couple of your routes to hold the same sidebar uh or the same color or the same uh uh alignment you
31:42
can create a layout in their organizational folder just like this and we're going to need this because we're
31:48
going to have many different routes some are going to need to have a sidebar like our server sidebar some are going to
31:55
need to have a sidebar for our channels and some of them like our invite page
32:00
are not gonna be are not going to need any sidebar at all same thing for our authentication so that's what we're
32:07
going to use this all folders and one cool thing that I like to do around here
32:13
is separate my routes inside of organizational folder using another
32:18
organizational folder so I'm going to close everything to make this simpler right here so inside of my Outlook
32:24
folder I'm going to create a new folder in Brackets routes like this and I'm
32:30
going to select both login and register and I'm going to drag and drop them inside routes like this just like this
32:36
and I don't know if this has happened to you as well but if it did what this is
32:42
is our hot reload cache is now unsaved because we dragged an active route into
32:47
a completely different place and you can see that I have this very weird file that has opened right now all you have
32:53
to do is save this file and if you think you did this wrong you don't have to worry the fix for this is very simple so
33:00
this is just a cash in hot reload so let's say you did something wrong and don't know how to fix it all you have to
33:06
do is shut down your application and run rmrf.next or you can manually just right
33:13
click and delete your next folder but make sure dot next folder but make sure you just shut down your application
33:20
first and you can see now I don't have that dot next folder but if I run the
33:25
application again it's going to be automatically created so I don't even know if that happened to you but often
33:31
when I play around with these routes and move them around like that that happens so I just show you a very a quick way to
33:39
fix that if it even happens to you uh great so now you can see how I feel like
33:45
this is a bit of a better structure so I have an organizational folder called out I have a layout and I have a separated
33:52
folder for all the routes that I'm going to use inside great great job and now
33:58
I'm going to remove this test page because I no longer need it and I'm gonna do something else here so I don't
34:05
like that this page that vsx is just sitting around in this app folder instead I'm going to create an
34:11
organizational organizational folder main like this and I'm gonna drag and drop page.dsx inside like this
34:19
there we go and you might be wondering well what's changed now well absolutely nothing you can see that our localhost
34:25
3000 slash is still aiming at this page.dsx and you might be wondering well
34:30
how it's in the main folder well that is because our main folder is an organizational folder meaning that it's
34:37
not affecting our URL and let's move this a one step further by creating a
34:43
new routes like this and drag and drop page inside of that as well and there we
34:49
go now again I have this uh next cache unsaved file so all I do is go inside of
34:56
that file save the file and close it and collapse everything that's it or if you think you've messed it up or it's not
35:02
clear to you what you have to do you can always go ahead and delete the next folder like this like and now the
35:09
application is not gonna you're gonna get this error right here so just make sure you shut down your application and
35:14
just run it again you didn't have to worry so this is just cash nothing scary about cash here great
35:21
now that I have that set up I'm just gonna go ahead and prepare uh and I'm
35:27
gonna go inside of this page that is X inside of our main folder and I'm gonna replace everything inside and I'm going
35:33
to write this is a protected route right here and I'm gonna remove this import
35:39
for the button like this so now it says that this is a protected route meaning that I only want logged in users to be
35:47
able to access this main routes page.dsx right here but in the out I'm completely
35:53
fine with people accessing page and register right here great so what I
36:00
prepared right now is an actual folder structure for our authentication which
36:05
we're going to add in The Following part so let me just quickly recap what we've done we've moved our page.vsx inside of
36:13
our uh organizational main folder inside of our organizational routes folder so
36:19
let me just clear this up you don't need this routes folder right this is just a
36:24
syntax sugar that I like to use to separate my routes for my from my layout
36:30
or if I maybe I'm gonna have components inside of this main folder so that's why I like to keep routes separated same way
36:37
I did here so you can see that layout is clearly separated from my routes and now
36:42
I know that this layout is affecting all of things inside of this routes folder
36:48
right here so I think that's kind of a good practice to do you can of course choose your own but for this tutorial I
36:54
suggest that you follow exactly the way I do so you don't have many problems problems great great job so in The
37:01
Following part we're gonna go ahead and set up Authentication now let's set up our authentication but
Authentication
37:09
before we do that I just want to make one important thing here so we're going to go ahead and go inside of our DOT git
37:16
ignore file right here so find your dot get ignore and scroll all the way down
37:21
to dot environment local and just add your own dot environment inside as well
37:28
because we're going to use a DOT environment file in order to set up our clerks so it's important that you add
37:35
this before you create your dot environment file so you never want to commit your environment keys because
37:41
other people can abuse them if your repository is public great so now that
37:47
you've set this up in your dot git ignore what you're going to do is I'm gonna collapse everything and let's go
37:52
inside of our browser and let's go to clerk.com so you can either Google clerk
37:59
authentication you can use the link in the description or you can go to clerk.com and what you have to do here
38:06
is you have to go ahead and either sign up or sign in so I already have an
38:11
account and I'm gonna go ahead and log in with Google great so once you're signing uh you you
38:18
either click create a new application or if this is your first time you're gonna see a screen just like this so I'm gonna
38:25
zoom in uh just so you can see what I'm writing here so go ahead and name your application for me it's going to be
38:30
Discord Dash clone like this and you can go ahead and activate as many of these
38:37
great providers that clerk offers you so I'm just gonna leave email address and
38:42
Google but you can activate Facebook Apple GitHub Microsoft whatever you want here you can even do some web 3 with
38:49
metamask right here but I'm going to leave it at email address and Google you can do whatever you want it's not gonna
38:56
matter but just leave Google and email address because uh it's easy and fast to log in great so make sure you've named
39:03
your application and click create application right here so I'm gonna expand this right now and there we go
39:10
now you have this quick start right here pre-selected with next JS if for any
39:15
reason it's not pre-selected just click on next JS right here and now it says to
39:20
paste this keys in your dot environment.local file but we're not going to use that we're going to use dot environment because we're going to need
39:26
it for some other libraries which are gonna which we are going to use so what you have to do is copy this keys in your
39:33
dot environment file so go ahead and either click on the show and copy everything or you can just use this copy
39:39
button right here great once you have that what you have to do is you have to create a new DOT environment file inside
39:47
of your file browser right here and just go ahead and paste the next public clerk
39:53
publishable key and clerk a secret key of course make sure this is all in one line uh mine collapses because I'm
40:00
zoomed in great so next public clerk publishable key and clerk secret key
40:05
great those two are important for you to have and now we're gonna go ahead and we're going to continue in docs right
40:12
here so make sure you click continue in and you should see uh use clerk with
40:18
next JS right here great so I'm going to zoom in here again so we can follow these instructions right here first
40:24
thing let's install the clerk slash next.js so you can just copy this right here or just follow along in my terminal
40:32
and see what I write there so I have the terminal here and I'm going to shut down my application
40:37
so npm install add clerk slash next JS like this let me just expand this a bit
40:44
more there we go and just press enter like that and wait a couple of seconds
40:49
for this to install great now that disk has been installed let's look at what is step two so step
40:56
two says set environment keys but we already did that from this page right here so no need to do it twice and just
41:04
confirm that you have these two in your dot environment file great so now we can go immediately to step 3 which says that
41:10
we have to mount the clerk provider so where do we Mount providers inside of
41:16
next 13 app router application well we Mount them inside of our root layout and
41:23
that root layout is inside of the app folder layout.tsx so not this layout which we
41:29
created in an organizational route we have to do it in this main layout right here because we want it to encapsulate
41:36
our entire application and all the routes inside of it great so go inside
41:42
of your root layout right here and go ahead and import
41:50
clerk Provider from at slash clerk next JS like this and now you can copy this
41:57
Clark provider and you can go ahead and follow this documentation make sure you
42:02
selected the app router instructions here and just go ahead and wrap the entire obligation application in a clerk
42:10
provider like this there we go and you can indent this inside
42:16
great now what we have to do is we have to add our middleware file to actually
42:22
protect our routes so make sure you added the clock provider to your app layout.dsx make sure you've saved this
42:29
file and now uh what you have to do is you have to create a new file inside of your
42:37
file browser called middleware.ds like this make sure you don't misspell this so it needs to be
42:43
middleware dot DS like that and you have to copy uh what it's written in this
42:50
step 4 in the clerk documentation and just paste it here or you can pause the
42:55
screen and write it but I recommend you just copy and paste it so all I did was click continue in docs and scroll to the
43:02
fourth step where it says protect your application because copying this is
43:07
prone to mistakes so it's better sorry yeah reading it from my screen and then manually writing is is prone to mistakes
43:13
but if you just copy it from here it's much simpler great so now that we have
43:19
the middleware.ts what we have to do is we have to create our sign up and sign
43:24
in pages so make sure that your app router is selected again and what I'm going to do is I'm going to
43:31
go inside of my app folder right here and I'm actually not just going to create a sign up folder like it's
43:38
written in the documentation because I prepared my organizational out folder and my organizational routes so what I'm
43:46
going to do instead is I'm going to remove this too so I don't need to login and register anymore you can remove them
43:51
and instead go ahead and create a new folder inside of this routes and name it
43:57
sign Dash up like this and inside of that folder create another folder with a
44:04
double square brackets like this dot dot dot assign Dash up again like
44:10
this so this is another convention in next 13 which is exposing all the
44:16
necessary routes for clerk to work inside of the app router and now inside
44:21
of that folder make sure you add page.tsx like this and you can just copy
44:28
and paste what it's written here like that there we go great and now we have
44:34
to do the same thing but for the sign in page so create a new folder
44:39
inside of your organizational routes sign Dash in like this and create a new
44:45
folder inside so double square brackets dot dot sign Dash in make sure you don't do any
44:53
typos here and create a new file page.dsx again go ahead and copy this
44:59
and paste it inside and save the file so now you have to page.ds access you have
45:06
a one for sign in which is importing the sign in component and one in sign up which is importing the sign up component
45:13
just make sure that is true for your files as well great and one more thing
45:19
that we have to do is very simply go back to in our DOT environment file
45:24
right here and you have to go ahead and copy this
45:30
routes and just paste them like this so how do we know uh that this clerk
45:36
signing URL goes to slash sign in and this sign up goes to slash is sign up
45:41
how do we know that well we know that because in our app folder we name that
45:47
routes exactly like that so if your folder name is signed in and your inner
45:52
folder has double square brackets dot dot dot sign in that means that this needs to be signed in that also means
45:59
that you can rename them if you want to if you want to name it login you can do that just make sure you replace login
46:05
here make sure you replace log in here and here as well same is true for sign
46:11
up if you want to replace that with register great so now that we have that
46:16
we can go ahead and we can run our application so npm run Dev like this
46:24
let's go back and let's refresh the this and let's see what happens now so let's
46:29
just wait a couple of seconds and look at this I'm redirected immediately to this sign up component and you can see
46:36
how it has a red background because our sign up and sign-in routes are inside of
46:42
this organizational folder which has this layout.dsx with BG red as
46:48
background so we can now finally remove this background red right we don't need it so we just need the H4 we also need a
46:56
flex we also need items Dash Center and we need Justified Dash Center so just
47:02
like that we centered both our sign in and if you click on sign up in this
47:08
lower no account text you can see that also the other page is centered so this
47:13
is how useful our layout is inside of our organizational folder because this
47:19
layout is reflected to all routes inside of this folder that's what I was trying
47:24
to explain to you earlier with the background color great so now what
47:29
should happen once we log in so you can either use Google or email and password you should get redirected to this
47:36
protected route right here and you can try manually if you change the url and try to access that protected route you
47:44
can see that I'm redirected back to sign in so I'm just going to go and log in with Google Now
47:49
and there we go I logged in and now this is a protected route is written right
47:55
here and now I need to add something to log out right so what we can do is this
48:01
very cool uh very cool component that clerk has which is in Step six in the
48:08
documentation called user button right here so again make sure you pre-selected
48:13
the app router and let's go inside I'm gonna I'm just gonna close everything and go back inside of your app folder
48:19
main routes page.esx right here and instead of saying this is a protected
48:25
route you can remove that and instead let's add the user button from at clerk
48:31
slash next JS like this and one important thing you have to add before you test the login or the log out is
48:39
after sign out URL like this and just make sure it leads back to slash if you
48:46
don't add this it's gonna go redirect to Clerks servers so make sure you do this
48:52
right here great and now you can go ahead and see the logged in user so I
48:57
can go ahead and manage my account here I can delete my account I can see my active devices I logged in with Google
49:04
which means that I can set my password I can look at my security so really really
49:09
cool and of course I can just log out and I am back here and yes so this is
49:15
what happens I did not refresh after I added after sign out URL so you can see
49:21
that my URL right now is no longer a local host so just make sure you go back to localhost like this
49:28
make sure you refresh this page I'm gonna go back login with Google
49:34
great and now I'm gonna go ahead and try one more time to sign out and there we
49:39
go now I am back in localhost in my sign in page so just make sure you're back
49:45
inside of the app logged in because for what we are going to do next we're going to have to be logged in so just like
49:53
this so I paused my screen and I logged in uh great great job you've successfully set up authentication uh
50:01
what we're gonna do next is we're gonna go and start working on our sidebar
Dark & Light Theme setup
50:08
so before we move on to creating our sidebar let's enable the dark mode and
50:13
the toggle between light and dark mode in this project so first thing I want to
50:19
do is I want to install a package called Next themes so let's go ahead and let's
50:25
go and run npm install next Dash teams like this and make sure you just press
50:32
enter and wait a second for this to install all right now that this is done what we
50:38
have to do is we have to go inside of chat CN documentation so go inside of
50:43
the documentation and click on dark mode in the sidebar right here and select
50:48
next.js as your framework so now let's go ahead and let's copy this theme
50:53
provider and let's add it in our components so I'm gonna go ahead inside of my components folder and I'm going to
51:00
create a new folder called providers so I'm doing this to so I differentiate between providers and between our actual
51:07
components and inside create a new file a team Dash provider.dsx like this and inside you
51:15
can just paste this right here so let me show you how this looks in full view so
51:20
we import react we import theme provider as next themes Provider from next themes
51:25
and we import the theme provider props right here a great and make sure it's
51:31
marked as use client so basically just copy the first step create a theme provider what we have to do now is go
51:38
inside of the app folder inside of layout.dsx right here and I'm just going
51:44
to collapse these children inside of my body here and what I'm going to do is
51:49
I'm going to add our newly created theme provider but make sure you don't import
51:55
it from next themes make sure you import it from ad slash components slash providers slash team provider so just
52:03
like this right here great now that you have the theme provider go ahead and
52:08
wrap the children around it just make sure you don't put this outside of body
52:14
so make sure you put it inside great now that we have that let's go ahead and
52:19
let's give it an attribute of class let's give it a default theme of dark
52:28
like this and let's give it enable system to be false and let's give it a
52:34
storage key of something unique like Discord Dash theme like that uh great
52:41
now we have that and that was basically the step two of this documentation that
52:46
I have opened on the side right here and one more thing I want to add is this suppress hydration warning to our HTML
52:54
element so go here and add the suppress hydration warning just like this great
53:01
and now if you visit your application let's actually run it so go inside of
53:06
terminal and run npm run Dev uh let me just okay so npm run Dev like
53:13
this just add the application let's refresh and let's see if anything uh changed right now I think the website
53:20
should be in dark mode like this so if yours is not in dark mode one thing you
53:25
can do is you can add forced theme to be dark like this and now it's 100 going to
53:31
be dark you can do the same thing with Force theme light like this and now it's light right but I'm gonna go ahead and
53:38
use the default theme dark and make sure you add the storage key like this and then you can go ahead and switch between
53:45
light and dark mode safely so now what I want to do is I want to add a toggle
53:50
button where we can manually switch between these two so I'm gonna collapse everything here I'm gonna go inside of
53:56
this documentation and I'm gonna follow step three add a mode toggle right here
54:01
so here you see how it's going to look so we can switch to dark and we can switch to light and let's go and click
54:08
into code right here and just copy this entire thing and let's go ahead
54:15
and let's go inside of our components folder and not inside of providers not
54:20
inside of UI but just inside of the components folder create a new file and
54:26
give it a name of mode toggle dot the SX like this and inside you can paste this
54:33
entire thing and you're going to notice that we get this error the drop down menu doesn't exist and that is because
54:39
it doesn't so we have to add the drop down menu from chat CN UI so let's go
54:45
ahead and let me zoom out a bit and go inside of components and find the drop
54:51
down menu component right here so this is what we are going to install this exact component so go ahead and run this
54:58
command and the X chat cn-ui at latest add drop down menu so I'm going to copy
55:03
this as npm because we're using npm here go inside of your terminal so I'm going
55:09
to shut down my application I'm going to paste this so this is the command npx chat scene UI at latest just add the
55:16
drop down menu and just go ahead and press y to confirm this installation
55:22
like this and after that is done you can go ahead and npm run Dev like this your
55:30
application again so your localhost is active great go back to your localhost
55:35
and make sure you refresh so every time you shut down your application and rerun npm run Dev make sure you refresh
55:41
otherwise your hot reload is not going to be working and you might be wondering what you're doing wrong and you can see
55:47
that now the error is gone that's because this UI drop down menu exists because we just added it with that CLI
55:53
command and you can see all the necessary components we need inside of that great so that is located right here
56:00
in the UI alongside our button and we already added the button in the first part of the tutorial so that's why the
56:06
error for button did not come great now that you have that you can go ahead and
56:13
I'm gonna close everything go inside of your app folder go inside of main routespage.vsx right here and after the
56:20
user button admin mode toggle from add slash components slash modes toggle like
56:26
this and you're gonna see this little icon which is now the moon but you can go ahead and click light and now it's
56:33
the sun like this great great job oh yeah and the system it can be enabled
56:39
only if you enable um inside of your app folder
56:45
layout.esx so I put this to false but you can put it to true you can either write through like this or you can just
56:51
add this so this is the equivalent and you can save and let's try system now
56:57
slight dark let me just refresh System Light
57:03
okay now it's working great uh but what I'm going to do is I'm actually going to
57:08
keep this to false because I've noticed some issues uh when switching uh when
57:13
having default the dark mode with this option enabled but you can try for yourself if your dark mode is on by
57:19
default just make sure that your system is not in dark mode right so you want I want to force the dark mode to my users
57:26
but I also want to enable them to switch to light mode but I want to force the dark mode even if their system is in
57:33
light mode right great so you can play around with these options right here it's important that you have the storage
57:39
key and the default pin is dark if you prefer dark but the attribute class is important great now that we have these
57:47
two we can go ahead and actually add them to our sidebar component so let's
57:53
go ahead and let's do that now my apologies I'm getting ahead of myself so we're not gonna do the sidebar yet uh
58:01
one more thing I want to add here is I just want to add a class name to the body whoops we already have the class
58:07
name so what I actually want to do is I want to import my CN from add slash lib
58:12
slash utils make sure you import CN right here and go ahead and leave the
58:17
font class name in the first one and in the second one we're going to add some different class names depending on
58:24
whether we are looking at this website in light mode or in dark mode so I'm gonna go ahead and write VG white so
58:31
this is for a light mode but on dark it's going to be BG PG like this whoops dark VG Dash open
58:39
square brackets like this and we're gonna paste in the hex code 31338 like this so now if I go ahead and
58:47
switch to dark you can see that it's no longer a fully black color instead it's this nice grayish color uh great so
58:56
that's it for setting up our uh theme what we're gonna do next is we're gonna set up a Prisma and our mySQL database
59:04
and we're going to start creating uh some models and some servers
Prisma & Planetscale setup
59:10
so what we're gonna do now we're gonna set up our database and our Prisma
59:15
schema the first step of doing that is adding some packages so let's go inside
59:20
of our terminal here and let's run npm install Dash capital D Prisma like this
59:27
and just press enter so after this Prisma has been added to
59:32
your Dev dependencies what you have to do is run MPX Prisma in it like this and
59:38
this is going to add one folder and it's going to modify our environment file so let's take a look at that so you can see
59:44
that now you have a new folder called Prisma and inside you have a schema.prisma file right here and if you
59:51
take a peek in your dot environment file you can see that the last thing we added was this clerk environment variables but
59:58
now we have this big comment and we have a database URL right here so this was
1:00:03
inserted by Prisma what we have to do next is we have to modify this with our
1:00:08
actual database so in order to do that I'm gonna use Planet scale so go to planetscale.com or just Google uh Planet
1:00:16
scale database and go ahead and either click get started or sign in depending
1:00:21
if you already have an account or not so your screen might look a little bit different but all you have to do is find
1:00:29
the new batteries and click create new database like this go ahead and give
1:00:34
your database a name so I'm going to use Discord tutorial like it is and make
1:00:39
sure you select the free hobby option so it's free forever and just make sure
1:00:45
that this is your first time building a database if you already have a database on planet scale you're gonna have to
1:00:52
remove your old one and then you can try again and this hobby option is going to
1:00:57
be available for you so you can always have one completely free database forever so make sure you select this one
1:01:04
and again confirm that it's free on the bottom right here and just click create
1:01:10
a database great so there we go now our database is initializing so Planet scale
1:01:16
is using MySQL which means that we are also going to have to do some modifications in our Prisma schema and
1:01:24
one more thing I want to give you a tip for is that if you're having trouble selecting the hobby option or creating
1:01:31
your database it is required for you to add a credit card regardless they are
1:01:36
not going to charge you so the credit card is just their security tip great so
1:01:42
let's just wait a second for this to connect there we go so it's initialized and now go ahead and find the connect
1:01:47
button and what you have to do is to create a password so let's click create a password right here and what we have
1:01:55
to do is we have to click connect with and select Prisma like this and now you
1:02:00
can see that we have our database URL for our myc database so make sure you
1:02:06
don't close this window because you're not going to be able to see this information again but don't worry all
1:02:11
you have to do is just create a new connection so go ahead and copy this dot environment file
1:02:17
and go back inside of your dot environment right here and what you have to do is replace this dummy database URL
1:02:24
which was inserted by Prisma and paste it with the real one like this and save your environment file
1:02:31
great now that that is done go ahead and select this schema.prisma tab and just
1:02:38
copy everything inside and you are going to paste that inside of your new Prisma
1:02:44
folder schema dot Prisma so just select everything and paste like this great so
1:02:50
that's it for Planet scale you can close this window now great now let's go ahead
1:02:56
and let's create some models inside of schema.prisma so the first model we are going to need is the profile model so
1:03:03
let's go ahead and write model profile let's give it an ID which is a type of
1:03:08
string has an ID decorator and a default value is unique ID like this great it's
1:03:16
also going to have a user ID which is going to come from our Clerk and every profile needs to have a unique
1:03:24
user ID so make sure you put that decorator as well name is going to be a type of a string image URL is also going
1:03:32
to be a type of string but it's also going to have at vb.txt so db.txt makes
1:03:38
it a kind of a special string you can Google more for the exact specifications but the thing I want to use it for is
1:03:45
that it gives me more characters for this string and image URLs can be pretty long so just in case uh I'm adding the
1:03:54
atdb.txt here let's go ahead and let's add email which is also a type of string
1:04:00
and let's also add add DB dot text like this great now let's go ahead and let's add created
1:04:07
at date time at default now like this and
1:04:13
let's create updated at date time add updated at like this great so now that
1:04:20
we have our profile model we can create our server model so model server like
1:04:27
this is going to have an ID which is a type of string ID decorator and default value of unique
1:04:35
ID like this great and now let's give it this server a name which is a type of
1:04:41
string an image URL which is a string with a decorator DB dot text
1:04:47
let's also give it an invite code like this so this is a type of string
1:04:52
and DB dot text great and now let's connect it to this profile model right
1:05:00
here so for that we have to write profile ID to be a type of string and
1:05:06
relation is going to be profile profile again with a capital P so we are
1:05:12
referring to this model right here go ahead and write add relation go ahead
1:05:20
and write fields and in the array write profile ID in the references you're
1:05:26
going to write ID and one more field you're gonna add is on delete to be Cascade like this great so now we have
1:05:34
an error because we have a relation in the server but the profile doesn't have a back relation with the server so we
1:05:42
have to go back inside of our profile model and we have to add servers like
1:05:48
this server and an array like this great so now the error is gone and now we have to
1:05:55
fix this warning the way we fix that is by adding add at index profile
1:06:02
ID like this great so now that we have our server let's just wrap it up by also
1:06:09
adding the created ad which is a date time default value of now and updated ad
1:06:16
which is also a date time with the value of updated at like this
1:06:21
great so now every server is also going to need to have a member and every
1:06:27
member is needs to gonna have its role so let's create an annual member role
1:06:33
like this with the possibilities of admin moderator and guest like this and
1:06:39
now we can create our model so I'm just going to zoom in back our model member
1:06:44
like this our model member is also going to have an ID which is a string decorator ID and the default value of uu
1:06:52
ID like this great Our member is also going to have a role so role is going to
1:06:59
be a member role with a default value of guest like this great now let's go ahead
1:07:07
and let's connect this member model with our profile model right here so we're
1:07:13
gonna have to do the same thing so let's write profile ID string and let's write profile raw file
1:07:21
again at relation builds like this profile ID references ID and on delete
1:07:31
Cascade like this now let's go back so it needs to be exactly the same as
1:07:38
this one in the server right so the error we are getting is that we have a relation from member to profile but we
1:07:45
don't have a relation from profile to members so let's add members member and
1:07:51
an array like this and there we go the error is now gone and let's go ahead and let's just add at that index
1:08:00
raw file ID like this great and every member is also going to need to have a
1:08:06
relation with the server that they are in so server ID is a type of string
1:08:12
server is a server at relation Fields server ID
1:08:19
references ID and on delete Cascade like this great now let's go back inside of
1:08:27
the server right here and let's write members to be member like this great so
1:08:35
it's a bit of a different relation as opposed to this profile that's because
1:08:41
here we are referencing the server ID which means that in the server we need to define the members it has like that
1:08:49
great and what we have to do now is add that index
1:08:54
server ID like this great let's also go ahead and let's add the created at which
1:09:02
is a date time with a default value of now and updated at which is date time
1:09:08
updated at like this great and one more thing we'll have to create is the
1:09:15
channel model and every channel model needs to have a channel type so let's go
1:09:21
ahead and write a new channel type and the possibilities are going to be text
1:09:27
audio so text audio and video like this great
1:09:34
and now let's write the model Channel we're just gonna have an ID so I'm going to zoom in back ID which is a string and
1:09:42
it's going to have an at ID decorator and add default guid like this great
1:09:49
channel is also going to have a name which is going to be a string and it's also going to have a type which is going
1:09:55
to be Channel type and the default one is going to be text great now we have to
1:10:01
connect the channel model with our profile so let's go ahead and let's write profile ID to be stringed like
1:10:08
this and let's write profile profile at relation Fields like this profile ID
1:10:16
let's write references ID and on delete Cascade like that great let's also write
1:10:24
server ID to be a string and server server at relation Fields server ID
1:10:33
references ID and on delete to be Cascade grade so we now connected this
1:10:40
Channel with both the profile and the server so first thing we have to do is
1:10:45
go all the way back to our profile so go ahead and find the profile and just
1:10:50
below the members just add channels Channel and an array like this so what
1:10:57
we have to do now is go back inside of the server right here and just below the
1:11:02
members let's add channels Channel like this great and now we can go back inside
1:11:09
of the channel right here and we can go ahead and add at index to be server ID
1:11:18
and add at index to be profile ID like this great
1:11:26
and let's also go ahead and let's add the created at which is at date time
1:11:32
with the default value of now and updated ad which is date time add
1:11:39
updated at like this great so we've written our
1:11:44
initial models of course we're gonna have more models like messages and conversations and direct messages but
1:11:51
this is enough for now great so what we have to do now is we have to go inside
1:11:57
of our terminal and we have to write two commands so we
1:12:03
have to do this every time we modify our schema dot Prisma so the first one is
1:12:09
going to be MPX Prisma generate so this is going to add this schema to
1:12:16
our node modules so we can safely develop with it after this has been done
1:12:21
what you have to do is run npx Prisma VB push so what this is going to do is it's
1:12:28
gonna create all of these collections into our planet scale or whatever you're
1:12:33
using for your mySQL database so in this tutorial I show you how to do it Planet scale but of course you can do it any
1:12:41
way you like it great so now that we did that what we have to do is we have to
1:12:47
create a util a database 0 which we're going to use throughout our API and our
1:12:53
server components so I'm going to do that inside of my label folder right here but before I do that let's go back
1:13:00
inside of our terminal and let's run npm install at Prisma slash client like this
1:13:07
great and now let's go ahead and let's go inside of our little folder and
1:13:14
create a new file db.ts like this go ahead and import
1:13:20
client from add slash Prisma client like this let's declare global
1:13:26
bar Prisma to be a type of Charisma client type undefined like this great
1:13:33
and now let's write export const DB to be Global this
1:13:38
dot Prisma pipe pipe new Prisma client whoops
1:13:47
like this great and now let's just write if process dot environment dot node
1:13:55
underscore environment is not production in that case
1:14:00
assign Global this dot Prisma to be DB like this great so what we did with this
1:14:08
small URL is we added a little hack uh in order for our hot reload in next 13
1:14:16
to not initialize too many Prisma clients so technically we could have
1:14:21
just done this right we could have just written this one line and that would be it that's how it's going to work in
1:14:28
production but in development we have something called hot reload and if we
1:14:33
just left it like this every single time we change a line of code in our project new Prisma client would be initialized
1:14:40
so what we did is we appended this Prisma client to a variable
1:14:47
globaldis.prisma because Global this is not affected by hot reload so I did not
1:14:52
invent this trick this is something I'm pretty sure you can find in the official
1:14:57
documentation of Prisma but also everywhere on the internet you're gonna find a very similar solution to this one
1:15:05
great so make sure you save this file what I want to do now is I want to
1:15:10
modify my initial page.dsx file which is currently inside of my main routes
1:15:17
page.dsx right here so I'm gonna do something different and I'm gonna use
1:15:22
this page.dsx to create our initial profile so every time that a new user
1:15:29
comes to our website we're gonna go ahead and create their profile and if
1:15:35
their profile already exists We're Not Gonna create it but we're just gonna load it so only one clerk login is going
1:15:43
to be able to have one profile great so we're gonna do that now
1:15:48
so let's go ahead and let's close everything here and I'm gonna go ahead
1:15:54
and I'm gonna delete this main folder right here so we're not gonna need it and also I am not running my application
1:16:02
so that's why I'm not getting any errors so make sure yours is not running as well and I'm gonna go ahead and create a
1:16:09
new folder in Brackets setup so this is going to be an organizational
1:16:14
folder and inside we're going to create page.esx let's go ahead and let's create this and
1:16:22
let's name it setup page like this and it's going to be an asynchronous
1:16:28
error function so make sure you put a sync like this and what we're going to
1:16:33
do inside is we're going to return a div saying create a server like this great so you
1:16:42
can go ahead and start your application now just to see how this looks so now it should load
1:16:48
this setup Page by default it should no longer load our little button here there
1:16:53
we go so now it says just create a server because you remove the main folder so our root file is now this
1:16:59
page.dsx because it is inside of an organizational folder as opposed to this
1:17:06
out folder which has its own routes so this is our root uh file right here
1:17:11
great now what we're gonna do inside of here is we're going to attempt to load
1:17:17
our profile so in order to do that let's go ahead and let's create a useful util to do that so I'm gonna go inside of a
1:17:25
lib and I'm going to create a new file initial Dash profile dot DS like this
1:17:31
great and let's go ahead and let's import current user and redirect
1:17:39
to sign in ROM at clerk slash next JS like this and
1:17:47
let's also import the structure DB from dot slash DB but the way I'm gonna
1:17:53
prefer it is using the Alias slash lib slash DB so both is completely okay I
1:18:00
just have a preference this is gonna work but I have a preference to use this
1:18:05
Alias sign right here it's clearer to me where things are great now let's go ahead and write export const initial
1:18:12
profile to Be an asynchronous Arrow function right here let's attempt to get the user
1:18:21
using clerk so cons the user is going to be await current user like this
1:18:27
if there is no user it means we are not logged in so let's return redirect to
1:18:32
sign in like this great now let's go ahead and let's attempt to find our
1:18:39
profile model so const profile is equal await DD dot profile so you can see how
1:18:45
it auto completes my profile and if I try DB dot member it also Auto completes
1:18:51
my member same thing for channel and server so for this one we need db.profile if you're getting an error
1:18:58
for this or if yours is not Auto completing make sure that you didn't accidentally misspell it inside of your
1:19:06
schema Prisma make sure that your schema Prisma is saved if you're just not sure
1:19:11
what's going wrong you can always copy the schema Prisma from my GitHub so make sure this is named profile and make sure
1:19:18
you run those two commands that we need so I'm not going to run them again I'm just going to write them so MPX Prisma
1:19:25
generate this is an important command for you to run an lpx Prisma DB push so
1:19:31
just make sure you've run those two great if you did that you're not going to have any problems so DB dot profile
1:19:38
dot find unique like this and go ahead and write where user ID is
1:19:47
equal to user dot ID like this great so we are going to attempt to find the
1:19:52
profile connected to this logged in user if there is a profile
1:19:59
we are very simply just going to return that profile the function can end here
1:20:04
but if it's not we need to create a new profile so const new profile is going to
1:20:09
be a weight db.profile.create like this
1:20:15
data is going to be user ID user dot ID like this name is going to be
1:20:23
openedactics user Dot first name like this
1:20:28
and user dot last name like this
1:20:34
image URL is going to be user.image URL and email
1:20:41
is going to be user dot email address open an array 0. email address like this
1:20:49
and there we go and just return new profile like this great so now that we
1:20:55
have this we can go back inside of our setup
1:21:01
page.dsx right here let's go ahead and let's import
1:21:07
initial profile from add slash lib initial profile like this and let's
1:21:12
write const profile to be a weight initial profile like that and what we're
1:21:19
gonna do now is we are going to attempt to find any server that this user sorry
1:21:25
this profile is a member of right so let's go ahead and write cons the server
1:21:32
do we await db.server dot find First where
1:21:38
members Oops I did not import DB so my apologies
1:21:45
so I'm just going to remove this just so we follow this so import DB from add
1:21:51
slash libdb my apologies I forgot to import that so now let's go ahead and write await
1:21:57
db.server dot find first where
1:22:02
members sum row file ID is equal to profile dot ID
1:22:10
so we're going to search through all the servers and we're going to find the first one that has the profile ID in one
1:22:19
of the members of that server so we're gonna assume that okay that this profile
1:22:24
is a member of that server and let's immediately load that server for the user uh in let's say a general channel
1:22:31
for example but if user is not part of any servers in that case we're going to
1:22:38
show this create a server so let's just go ahead and write if there is a server in that case return
1:22:45
redirect which you can import uh well from none of those you can import it
1:22:51
let's let's do it manually so import redirect
1:22:57
from next slash navigation like this great so redirect
1:23:03
Open brackets open backticks slash servers slash open this special object
1:23:11
server dot ID so if we manage to find the server that this profile is a part
1:23:17
of we're gonna immediately redirect them to that server if there is no such server we're gonna show them for now
1:23:24
just a text create a server but we're going to turn that into a model where users can create a server so what's
1:23:32
going to happen once I refresh this is we're going to go ahead and try to find an existing profile with this clerk ID
1:23:39
if there is one we are going to return it if there isn't we're gonna go ahead and create it so what I recommend you do
1:23:46
now for the full experience is just open a new terminal and write npx Prisma
1:23:52
Studio like this and you can go ahead and open this so
1:23:58
I'm just gonna collapse this I'm going to open this so localhost 555 like this
1:24:03
and there we go so right now I have no profiles uh inside of my application so
1:24:09
I'm going to save this setup page.dsx and I'm gonna go ahead and I'm gonna
1:24:14
attempt to refresh right here and let's check our terminal to see if we got any
1:24:20
error perhaps so it seems like no errors here which means that if I go inside of my Prisma
1:24:27
studio and if I refresh right here there we go so my ID is here my user is here
1:24:35
and my name is right here so you can see that now it says that profile has one
1:24:42
member sorry one collection right here so you should have the very same result
1:24:47
and now if you refresh again and try and refresh your MPX Prisma Studio here you
1:24:53
can see that it's still just one profile so you did not create duplicate profiles for this user great that is exactly what
1:25:01
we wanted and since you didn't find any server it showed us this div saying
1:25:07
create a server so that's what we're gonna do next we're gonna create a model which is going to prompt users to create
1:25:14
their own servers great great job so far what we are going to build now is we are
Initial modal UI
1:25:21
going to replace this div saying create a server which is rendered if there is
1:25:27
no server that this user is a part of and in order to do that we're gonna need
1:25:32
to import some components from chatzi and UI so let's prepare our terminal
1:25:38
here so I have my Prisma Studio here running but I can shut that down I don't
1:25:44
need it right now so I just want this one server right here and I'm going to shut down my application as well
1:25:51
so let's go inside of chat cnui and head into the components here so we're gonna
1:25:57
need to add a couple of components first one is going to be a dialogue because
1:26:02
this uh model to create um our server is going to be inside of a
1:26:08
dialog so let's get that component first so let's go ahead and find the dialog component
1:26:13
and let's go ahead and let's add this command so I'm just going to expand my screen right here I'm going to copy this
1:26:20
as npm and I'm going to paste it here so the command is npx chat cn-ui at latest
1:26:27
add dialog and let's just press enter here and confirm that you want to install that once that is done let's go
1:26:35
ahead and let's find some other components here so besides the dialog we are also going to need an input
1:26:41
component so let's go ahead and find the input right here okay and let's whoops and let's install
1:26:48
uh that as well so MPX chat cnui latest add input I'm gonna copy that as well
1:26:55
and the same way I did with the dialog I'm gonna paste this and I'm just gonna
1:27:00
go and press enter and confirm this installation and one more thing we need
1:27:06
is the entire form so we're gonna be installing a react hook form and we're
1:27:13
also going to be installing Zod with this one CLI Command right here so
1:27:19
scroll all the way down to installation right here and copy nvx chat cnui latest
1:27:25
add form like this so I'm gonna paste that here let me expand my screen a bit
1:27:31
more so you can see it in one line so npx chat cnui at latest add form so this
1:27:37
one right here and press enter and just confirm the installation
1:27:42
and after the ad uh some new packages in our project great now that this is done
1:27:48
you can go ahead and do npm run Dev so your project is back and running on
1:27:53
localhost so I'm going to refresh my localhost right here so I ensure that everything I do is up to date
1:28:00
uh great so what we have to do now is we have to replace this create a server div
1:28:07
with rendering of our initial model like this which now doesn't exist so when I
1:28:14
save the file I'm going to get an error so let's close everything here let's go inside of our components and I'm going
1:28:21
to go ahead and create a new folder here called models so I'm going to keep all
1:28:26
of my models inside of this folder right here so they don't get mixed with stuff like mode toggle or providers and inside
1:28:34
go ahead and create initial Dash model dot DSX like this great and let's go
1:28:40
ahead and let's start developing this right here so first thing I want to do is Mark this as use client because this
1:28:47
is also going to be a form which means it's going to have a lot of interactivity inside great so let's go
1:28:52
ahead and let's write export const initial model like this
1:28:59
and let's go ahead and let's just write a div saying this will be a model like
1:29:06
that and now we can go back inside of our app folder inside of setup page.psx
1:29:11
and let's go ahead and import this so initial model from add slash components slash models slash initial Dash model so
1:29:20
this line that I've added right here let me just expand my screen so this is how it should look like and save this file
1:29:26
and there we go no more errors now we just have a text saying that this will be a model so let's actually go ahead
1:29:33
and import everything we need from the dialog which we just added in chat cnui so let's take a look at our components
1:29:40
UI right here so now you should have the dialog.tsx the form.tsx input and
1:29:47
label.dsx the button and drop down have existed here before great so let's go
1:29:54
ahead whoops let's go back inside of our initial model here must import all the necessary things we
1:30:01
need from add slash components
1:30:06
slash UI slash dialog like this so we are going to need the dialog we're going
1:30:12
to need the dialog content we're gonna need the dialog description the dialog
1:30:19
Hooter the dialog header and the dialog title like this great so now let's go
1:30:27
ahead and let's create that so instead of rendering this div right here we're gonna render the dialog component like
1:30:33
that and let's give it the default value of open to be true or you can just write
1:30:39
this so it's the same thing and inside let's go ahead and let's add the dialog
1:30:44
content so we already have that imported and let's add that class name BG Dash
1:30:51
white text Dash black padding Dash zero
1:30:57
overflow Dash hidden and save the file great and now we can see uh how I have a
1:31:04
small line right here which is of course going to expand the more content we add inside so this is a dialog which is
1:31:11
going to be open by default because that's the way we're going to use it so it's going to be rendered if there are
1:31:16
no servers so no need to add any controls to open or close it great so
1:31:22
inside of this dialog content with this class names that we have right here let's give it a dialog header which we
1:31:28
also have imported and let's write customize uh your server like this great and let's
1:31:37
give this a class name of text Center and text Dash sync
1:31:44
uh whoops my apologies so I got ahead of myself let's delete that the dialogue uh
1:31:50
header so what I just uh wanted to write is uh
1:31:56
gonna be inside of dialog title not dialog header sorry so yes the first thing is dialog header but with the
1:32:01
different class names so dialogue header is just going to be our spacing so dialog header is going to have a padding
1:32:07
top of eight and it's gonna have a padding on the side of six like this and
1:32:14
then inside we're going to use the dialogue title my apologies so like this this is the complete code great and
1:32:20
inside we're going to write customize your server or create your server however you want it and let's go ahead
1:32:27
and let's give this a class name of tax Dash to excel text Center and font Dash
1:32:33
bold like this great so you can expand a bit to see how this looks and now let's go ahead and
1:32:41
let's create our dialog description just below this dialogue title so go ahead
1:32:47
and add dialog description here so inside of the dialog header and go ahead
1:32:52
and write give your server a personality
1:32:57
like this with a name and an image you can always change it later like this
1:33:06
and let's go ahead and give this dialogue description a class name of text Dash Center and text Dash sync
1:33:17
like this Dash 500 like that there we go okay so I'm just gonna expand a bit and there we go great now
1:33:25
above the dialogue below the dialog header right here we're gonna go ahead
1:33:31
and add our form so let's go ahead and let's prepare all the stuff we need for
1:33:37
our form so right here I'm gonna write const form to be equal to use a form
1:33:42
from react hook form like this go ahead and open uh this object inside and let's
1:33:50
go ahead and let's give you the default values of a name and image URL and both of them
1:33:58
are empty by default now let's go ahead and let's import uh Zod and Zod resolver
1:34:05
so we can validate this form using our form schema so here at the top I'm gonna
1:34:10
add import Asterix as Z from Zod and I'm gonna add import I'm gonna distract Zod
1:34:18
resolver from at
1:34:24
hook form slash resolvers slash Zod like this and I'm gonna move react hook form
1:34:30
above with them right here uh great so now that we have that outside of the
1:34:36
initial model we can create our form schema so const form schema is going to be Z dot object
1:34:45
name is going to be Z dot string dot minimum one and let's give it a custom
1:34:51
message to the server name is required like this and below that image URL is
1:35:00
going to be Z dot string dot mean one and a custom message for this error is
1:35:06
going to be a server image is required like this great so now
1:35:13
we have the form schema and now we can connect it using this Zod resolver inside of this use form hook right here
1:35:21
so above the default values go ahead and add the resolver like this Zod resolver
1:35:28
on schema like this there we go great and now let's go ahead and let's just
1:35:35
extract the loading state from this form so we can know when to disable our inputs if it's currently submitting a
1:35:42
request so const is loading it's going to be form.form state that is submitting
1:35:49
like this great and let's just add the on submit function which for now is just
1:35:55
gonna log our values so const on submit is going to be an asynchronous function
1:36:01
which takes in the values which are a type of Z dot infer open pointy brackets like this and right
1:36:07
type of form schema so our form schema is defined
1:36:13
outside right here I'm just going to expand things a bit so they are in one line all right so this is going to be an
1:36:18
arrow function and all it's going to do is log the values like this so that's
1:36:24
all it's going to do for now great now let's go ahead and let's
1:36:29
actually import all the stuff we need from our form so just below this dialog
1:36:35
let's go ahead and let's import the following things from add slash components slash UI slash four
1:36:43
we're gonna need the form we're going to need the form control we're going to
1:36:48
need the form field like this so form field we're going to
1:36:54
need a form item form label and form message like this and let's also go
1:37:02
ahead and import uh our inputs
1:37:07
from add slash components slash UI slash input and let's also import our button
1:37:17
from add slash component slash UI slash button
1:37:22
like this okay and now we can go ahead and find the end of this dialog header
1:37:28
right here and we can actually uh go below that so still inside of dialog
1:37:34
content but just below the dialog header add a form
1:37:39
which we imported like this and go ahead and open curly brackets and spread our
1:37:46
form which comes from this use form right here so we are passing all the
1:37:51
necessary props it needs uh great so inside of this form let's go ahead and
1:37:56
let's add an HTML native Forum element so form like this let's go ahead and
1:38:03
let's give this an on submit of form dot handle submit on submit like
1:38:10
this so we're going to use the handle submit from our form hook and we're going to pass that to this custom on
1:38:17
submit so we can work with those values passed by that form after it's been validated great and now back to this
1:38:23
native html4 element let's just give it a class name of space Dash y-8 like this
1:38:31
okay and now what we are going to do is I'm just gonna go ahead and create a div
1:38:38
with a class name of space Dash Y dash eight
1:38:45
bx-6 like this and inside let's create a div like this with another class name
1:38:54
blacks items Dash Center justify Dash Center and text Dash Center like this
1:39:01
and all I'm gonna write is to do image upload okay so this is going to be our image
1:39:07
upload component uh right here great and now what I want to do is just go outside
1:39:14
of this div for image upload and go ahead and add the form field which we
1:39:20
imported and form field is actually a self-closing tag so just like this great and now let's go ahead and let's give it
1:39:28
a control of form dot control
1:39:33
and let's give it a name of name because that is the field name that this form
1:39:40
field is going to control and let's give it a render option let's go ahead and destructure a field
1:39:47
immediately from this Arrow function like this and let's go ahead and let's add the
1:39:53
form item inside we already have that imported let's go ahead and let's add
1:40:00
the form label inside like this and let's just write server name like this
1:40:07
and let's give it some Styles so I'm gonna add a class name here to be
1:40:13
uppercase text Dash XS font Dash bold like this text Dash sync Dash 500 on
1:40:23
dark mode we're going to use text Dash secondary 70 like this there we go and below the
1:40:31
form label let's go ahead and let's add the form control we also have that
1:40:36
imported already and inside of that we're gonna add our input component which is a self-closing tag let's give
1:40:44
it the value of disabled to be is loading like that and let's give it a
1:40:51
class name of BG Dash sync Dash 300 slash 50 like
1:40:58
this a border of zero like that a Focus dash visible
1:41:05
column ring Dash zero like this text Dash black
1:41:11
and Focus dash visible pollen ring Dash offset Dash zero as well great let's
1:41:20
also give it a placeholder to be enter server name like that and
1:41:27
let's go ahead and spread dot dot field which we get from this render the
1:41:33
structuring right here so by spreading the field we spread all the necessary on
1:41:39
change on blur and on Focus handlers using react hook form in this nice and
1:41:45
easy way and great you can already see how our model is starting to look like something now let's go ahead and let's
1:41:53
go ahead and let's find the end of this div right here but still inside of this native HTML form element and let's go
1:42:02
ahead and let's add the dialog footer which we already have imported and what
1:42:08
we're gonna do is we're going to add a class name to be BG Dash gray Dash 100
1:42:14
px-6 and py-4 like that and inside we're
1:42:19
gonna go and render a button which will also already have important and we're just gonna write create like this and
1:42:27
let's go ahead and give it a class name uh sorry we're not going to give this
1:42:33
button any class names we're just going to give it a disabled prop of his loading like this great so now if I
1:42:41
expand this there we go we have a small create button right here and one thing I want to do is I want to add a variant to
1:42:48
this button called a primary so let's go ahead and what we're going to have to do
1:42:54
is we're gonna have to go uh inside of our components folder inside of UI and go inside of
1:43:02
button.vsx and just like we did in the beginning of this tutorial I'm gonna add a new variant here so find the variance
1:43:09
object go inside of another object here called variant find the link right here
1:43:14
and below the link add a new variant called primary like that and let's give
1:43:20
it a background of indigo Dash 500 a text Dash white and hover is going to be
1:43:26
BG Dash Indigo Dash 500 sorry Indigo Dash 500 slash 90
1:43:34
like this so let me just expand this so you can see it in one line so this is
1:43:39
the line that I added so background Indigo 500 text is white and on Hover we
1:43:45
also use the background Indigo but with an opacity great now save this file you
1:43:51
can close this button go back inside of your initial model find this button and give it a variant of this new we created
1:43:59
oops not secondary but primary option right here there we go now it looks much
1:44:06
much better and uh one thing that we missed is uh the form message that we
1:44:12
need to add whoops so I just expanded a bit too much so go ahead and find your input right
1:44:20
here and one thing that we need to add below this form control right here is
1:44:26
the form message like this so that's it that's all we have to do and now if you
1:44:32
try and click on Create and not fill anything inside you're gonna have this error right here so I'm going to refresh
1:44:38
to demonstrate so let's click and create and there we go now let's just quickly
1:44:43
do a fix for these errors right here so we have a hydration error because this is a model and models are notorious for
1:44:50
causing hydration errors so in order to fix that uh we're gonna go ahead and do
1:44:55
a little mounting trick here so what you have to do is find the start of your
1:45:01
initial model and write const is mounted set is mounted
1:45:07
to be equal to use state from react so make sure you've imported uh use state
1:45:14
from react as I did right here and give it a default value of false like that
1:45:19
now let's go ahead and let's write use effect also from react so make sure you
1:45:25
import the use effect and you state from react like that and in this simple arrow
1:45:30
function inside with this empty dependency array all we're going to do is set is mounted to True like that and
1:45:39
now what we are going to do is just before this return dialog we're gonna
1:45:44
write if exclamation point is mounted so if it's not mounted return now like this great
1:45:52
so now if you try and refresh you'll see that no more hydration errors are
1:45:58
happening and the form still works as expected uh great great job so we set up
1:46:06
our hook form we set up our validation what we have to do next is we have to
1:46:12
create this image upload component and we're going to do that by setting up upload thing so that's what we're gonna
1:46:19
do in the next part great so what we have to do now is
UploadThing setup
1:46:25
create this upload image component and we're gonna do that using upload thing
1:46:30
so I'm going to expand my browser screen and I'm going to visit uploadthing.com so you can either visit
1:46:37
that website or just Google upload thing go ahead and sign in using GitHub like
1:46:43
this and after that you're gonna get redirected to your dashboard as you can see I already have one application here
1:46:50
because I was testing it out but you can ignore that yours is probably gonna be empty so what you have to do is find
1:46:56
this create a new app button uh in my top right corner go ahead and give your
1:47:03
app a name so in my case it's going to be Discord Dash tutorial and you can
1:47:08
leave the second field empty and just click create app like this now you're
1:47:13
gonna go ahead and head into this sidebar where it says API Keys click on
1:47:19
here and what you have to do is just copy this and garment keys and paste
1:47:24
them inside your dot environment file so I'm going to go ahead and close everything I'm gonna go inside of my DOT
1:47:31
environment file and after our mySQL database URL just paste your upload
1:47:36
thing secret and upload sync app ID which you just copy so let me expand my screen a bit okay great now let's go
1:47:45
back inside of the overview right here and let's visit the getting it started guide right here
1:47:52
uh great so uh you can read a bit more about this if you're interested in how
1:47:58
it works uh but we're gonna go immediately to the getting started uh uh field right here so first let's set up
1:48:05
all the packages that we need so we're gonna need to install all of this here so you can just copy it or you can look
1:48:11
at my terminal right now so I'm gonna go inside of my terminal I'm going to shut
1:48:18
down my application and I'm going to paste that so we are doing npm install upload thing
1:48:25
upload things slash react and react Dash drop zone so all of this is in one line
1:48:32
don't get it confused I'm just zooming in so you can read it easier and just press enter like this and wait for all
1:48:39
of those to install great after this has been installed we've successfully set up the packages
1:48:46
so the step two is adding environment variables but we already did that great
1:48:52
so now we have to set up our next JS application so if you're using the pages
1:48:58
router click on pages but if you're following this tutorial click on app router right here so first thing we have
1:49:05
to do is we have to set up our file router right here so let's go ahead and
1:49:11
I'm just going to zoom in so we're going to create this app API upload thing core TS file first let's go right here
1:49:20
and let's go and close everything and go inside of the app folder create a new
1:49:26
API folder and inside create another folder called upload
1:49:33
thing like this and inside create a new file core dot DS like this and inside
1:49:40
you're gonna paste this entire thing so let me just zoom out so I am in the
1:49:46
documentation under the next JS setup selecting the app router option right
1:49:51
here so just copy this and paste it in here great so we are
1:49:57
going to modify this a little bit so this out function right here is of course a fake out function because well
1:50:05
of course they cannot assume what we are using for authentication so let's go ahead step by step and modify this so it
1:50:11
works for our case so we are using clerk for authentication so let's go ahead and import out
1:50:18
from add clerk slash next JS like this and now let's go ahead and remove this
1:50:25
fake alph function here and let's name it cons handle out like this which is an
1:50:31
arrow function let's extract the user ID so const user ID is equal alph like this
1:50:38
and let's write if there is no user ID in that case throw new error
1:50:44
unauthorized like that and return
1:50:50
user ID user ID like this great now
1:50:55
let's go ahead and let's modify this our file a router so I'm just going to
1:51:01
remove the comments so we can focus on exactly what we need to change and what I'm going to do is I'm going to remove
1:51:07
everything inside of this file router so this is my entire code so export const
1:51:12
our file router satisfies this file router and inside we're gonna create our
1:51:18
own cases so first one is going to be a case for uploading the server image so server image is going to be a function
1:51:25
so this is this constant that we have right here go ahead and extract
1:51:32
uh sorry we're not extracting anything we are just passing in the configuration so we we are going to accept an image
1:51:39
go ahead and open an object with Max file a size to be four megabytes
1:51:46
and Max file count to be one like that great now let's go ahead and let's chain
1:51:52
the middleware like that which is going to be an arrow function which is going to call the handle alph function like
1:52:00
this and let's change the on upload complete which in my case is just going
1:52:05
to be an empty Arrow function like that now let's also do the message file so
1:52:11
we're gonna need this later when we start uploading attachments in our messages but I just want to prepare it
1:52:17
already so for our message file again called the F function and let's give it
1:52:22
some options on what we can upload so instead of actually passing in an object we can pass in an array like this and
1:52:30
just select an image and PDF like this you can of course go ahead and play
1:52:35
around with all of this amazing options that it offers you you can pass in videos all that stuff but I'm just going
1:52:41
to work with images and PDFs for this tutorial let's add the middleware like that
1:52:46
let's call the handle out like that and on upload complete in my case it's just
1:52:53
going to be an empty Arrow function like that and one thing I forgot was after
1:52:58
this on upload complete for the server image just remember to add a comma because we are working inside of an
1:53:04
object right here great so now we modified uh this core to work with our
1:53:10
case so before we move on I just want to change one thing in the handle out so
1:53:18
instead of const user ID from out we actually have to destructure that so my
1:53:24
apologies even though this would still technically work because if there is no authentication object it's fair to throw
1:53:30
an error but let's just return the user ID properly like this great now let's go
1:53:37
ahead and let's see what is the next thing that we have to do here so now we have to create
1:53:45
um this next GS API route which uses this file router which we just created
1:53:50
so I'm going to zoom in again to see what is the second step right here so we have to create a route.ds inside of the
1:53:56
upload thing folder so let me just expand this like that and in this folder upload
1:54:04
thing where we have core.ds go ahead and create a new file a route.ts like that
1:54:10
great and now what you're going to do is you're gonna paste this from the
1:54:15
documentation right here so you can just copy this it's a very simple code snippet and paste it here great and you
1:54:23
should have no errors because we have the package installed and we have the dot slash core file in the same folder
1:54:30
right here great now let's see what are the next steps here
1:54:35
so you can play around with creating this uh uploading components and we are
1:54:41
going to use uh some of those so let's go ahead and let's go so this one uses
1:54:47
the source utils folder but none of this is set in stone so you can organize this however you want so what I'm gonna do is
1:54:55
I'm gonna close everything just make sure you've wrapped up this route.vs so save this file I'm gonna close
1:55:01
everything I'm gonna go inside of lib right here I'm gonna create a new file called upload
1:55:08
thing.cs like that and let's go ahead and let's copy this step three creating
1:55:13
the upload sync components here like that and let's just paste it here so
1:55:20
obviously we have to modify it a little bit I'm getting this error here we're gonna resolve that now so instead of
1:55:26
using this curly sign let's use the add sign like this so add slash app API
1:55:31
upload thing slash core great and now we are ready to actually use
1:55:38
this uh inside of our initial model so I'm going to close everything here uh
1:55:44
and well you can keep the upload thing open what I would recommend is that you actually go ahead and visit the
1:55:50
dashboard and go inside of your newly created app right here and click on
1:55:55
files so you can confirm that the files are uploaded or not so just keep this page open great now let's go back inside
1:56:03
of our application here and before we continue developing let's just go ahead inside of our middleware file so let me
1:56:12
just find it right here and let's extend this out of the middleware with public routes an array and just pass in slash
1:56:20
API slash upload thing so upload thing is out protected for uploading but we
1:56:27
still need to add it to public routes to avoid potential errors you can find that information in the documentation of
1:56:33
upload thing great now let's go ahead and let's go back inside of components models initial
1:56:40
model right here and let's start modifying this uh to do which we've written right here and let's start by
1:56:47
wrapping this uh in an actual form field so I'm going to write form field we
1:56:53
already have that and again form field is a self-closing tag let's go ahead and let's give it a control of form dot
1:57:00
control like that let's give it a name of image URL and let's give it a render
1:57:06
extract the field in this Arrow function and immediately return like this
1:57:14
a form item like that a form control like that and now you can just go ahead
1:57:22
and write a file upload let's just see how that looks
1:57:27
and yeah I have not uh started my app my apologies so let's go inside of the terminal and npm run Dev so I just want
1:57:35
to confirm that there are no errors here before we actually create uh our file upload component so let's just wait a
1:57:42
second for this to load uh okay great so no errors and now let's replace this
1:57:48
with the file upload component like this and if you save this you're gonna get an
1:57:54
error so let's go inside of our components and create a new file file
1:58:00
Dash upload dot DSX like that let's mark it as use client like this and let's go
1:58:08
ahead and let's export const file upload like that and let's just return a div
1:58:13
saying file upload component like that so we know it's coming from the file
1:58:18
upload let's go back inside of our initial model and now let's upload sorry
1:58:23
let's import this so file upload from dot dot slash file upload codes like that and if you save the error should go
1:58:30
away and you should see this text file upload component let's just see how I imported this so I imported it from file
1:58:38
upload from dot dot slash file upload but I want to change it to add slash components I think that just looks
1:58:43
better and I'm gonna go ahead and move my react import to the top right here
1:58:49
with the other package Imports so I always like to separate my chat CN and
1:58:55
my component Imports with the global inverse you don't have to follow that exactly but it's what I prefer to do
1:59:01
great so now we have this file upload component right here and let's go ahead
1:59:07
and let's just prepare it a bit so inside of the initial model inside of this empty file upload let's go past it
1:59:13
some props so endpoint for this one is going to be server image and if you remember where I'm getting this from you
1:59:20
can visit core.bs from App slash API upload thing in our file router and you
1:59:27
can see that I have server image and message file so then depending on what I want to upload I'm going to pass that in
1:59:33
as the end point great so core is inside of app folder API upload thing if you're
1:59:39
wondering okay so I'm passing the server image inside I'm passing the value to be
1:59:45
field dot value and I'm passing the own change to be field Dot on change like
1:59:51
that so field.value and field dot on change great now let's modify our file
1:59:57
upload to accept this props so I'm gonna write interface
2:00:03
foreign upload props like that
2:00:08
we're gonna go and accept on change to Be an Arrow function which returns a
2:00:14
void but inside of its props is going to have an optional URL like that
2:00:21
let's give it a value of string and an endpoint possibilities of message file
2:00:28
or server image like that so while you're writing this make sure that it
2:00:35
matches uh this so let's see what's the uh okay no no worries about it yet so when you're writing this endpoint
2:00:41
message file and server image please confirm inside of your app API uploading
2:00:48
core.ts that it matches these objects right here it's a server image and message file it needs to match exactly
2:00:55
those two right here great now let's assign this props in this file upload
2:01:00
component so I'm going to extract all of those so on change value and end point like that and let's just
2:01:08
add the prop file upload props like that great and you can see how in my initial
2:01:13
model all the errors are gone and if I try something that doesn't exist you can see that I have an error so I can only
2:01:20
do a server image or message file for this case it's going to be server image
2:01:25
because we are creating our server great so now in this file upload component let's go ahead and let's create a an
2:01:34
actual upload drop zone for this so in order to do that let's go ahead and
2:01:39
let's import upload Drop Zone from
2:01:45
add slash lib slash upload thing like this so don't do a mistake don't import
2:01:50
it from some package we are using our upload thing lib so this is an important thing and below that go ahead and import
2:01:58
at upload sync slash react slash Styles dot CSS so we get some nice styling uh
2:02:06
great now right here instead of rendering this div let's go ahead and
2:02:12
let's render the upload Drop Zone which we just imported let's go ahead and give
2:02:17
it an endpoint type you can see that this endpoint also only has options of message file and server image so it
2:02:24
matches our props right here so we can safely pass the endpoint prop and it's going to work great and now let's do the
2:02:32
on client upload complete like that
2:02:39
to be a response like that and all I'm gonna do is on change response question
2:02:47
mark DOT first in Array dot file URL like this great and let's go ahead and
2:02:55
let's do on upload error to be error type of error like that
2:03:04
and well you can either console we can console log this for now like this great
2:03:11
let's go ahead now and let's actually check if this is working right here so I
2:03:17
have no files inside of my upload thing now but let's see what happens if I try
2:03:22
and add an image from unsplash so I'm going to click this click on upload and
2:03:30
let's see if this succeeds so let me refresh my upload thing now and there we
2:03:36
go so you can see this image from unsplash is right here great so you
2:03:42
successfully uh created your upload thing Drop Zone what we have to do now
2:03:47
is we have to find a way to control to show different uh render depending on
2:03:53
whether we uploaded an image or not because we want to see what we just uploaded so let's go ahead and let's do
2:04:00
that now and as you can see I have a small strike
2:04:05
over this file a URL it seems like there was an update with upload thing so
2:04:10
there's a very simple explanation here it says that this declaration was marked as deprecated and that we use URL
2:04:17
instead so let's go ahead and replace this with URL like this there we go so
2:04:23
I'm pretty sure file URL is still going to work but it's deprecated so use URL
2:04:29
to have the most up-to-date version great all right now let's go and let's
2:04:35
actually try and find a way to render this image right here so in order to do
2:04:40
that let's go all the way to the top first whoops okay and let's go ahead and import X
2:04:48
from Lucid react like that and let's go ahead and let's import image
2:04:54
from next slash image like this great and now let's go ahead
2:05:02
and check if we have a value if we have a value that means that we are ready to
2:05:08
render something great so let's first extract the file type so const file type
2:05:13
is going to be value dot split so we are practically checking that URL and we're
2:05:20
going to go ahead and split this by a DOT dot pop like this and now we're gonna
2:05:27
check if there is a value and if file type is not PDF that means okay this is
2:05:35
an image so we can go ahead and return a div with a class name
2:05:42
of relative h-20 and w-20 and you can already see that we no longer have that
2:05:48
drop zone we now have a space to render our image inside and now let's actually use this image which we imported from
2:05:54
next slash image so make sure you have this import right here and let's go ahead and give it a Field property a
2:06:01
source to be value property and ALT to be upload like that whoops and let's
2:06:07
also give it a class name of rounded Dash full and if I save this I'm pretty
2:06:13
sure I'm going to get an error that is because we have to add upload thing to
2:06:18
our list of domains for images so let me show you this again I'm gonna go ahead and I'm gonna upload this unsplash image
2:06:25
right here and after it's uploaded we should get an error right here because upload thing is
2:06:33
not configured under your images in x.config.js so that is actually uh very
2:06:39
uh simple to fix so what you have to do whenever you get this error when you add
2:06:45
a new image go ahead and find what hostname it says so in my case it's uploadthing.com and I'm pretty sure it's
2:06:52
going to be the same in yours so go ahead and go inside I'm going to close everything and go inside of your
2:06:59
next.config.js inside of this object add images add domains like this open an
2:07:06
array and just paste in uploadthing.com and what I recommend doing is restarting your application
2:07:13
entirely so npm run Dev like this and refresh your application
2:07:22
and I'm gonna go ahead and I'm gonna back go back inside of my components file upload.tsx and let's try this one
2:07:30
more time so I'm gonna go ahead and upload this file right here and let's
2:07:36
see what happens and there we go you can see that I have my uploaded image right here and one
2:07:43
thing what that I want to do is I want to add a button to remove it so let's go ahead and add a button so just a normal
2:07:50
button native HTML button element and let's go ahead and let's render the X
2:07:56
which we imported from Lucid react right here and let's go ahead and let's give
2:08:02
this button a class name of h-4 and W-4
2:08:07
and let's go ahead and give this button an on click to Be an Arrow function
2:08:12
which calls the on change and just sends an empty string and class name for this
2:08:18
one is going to be BG Dash rows Dash 500 text Dash white padding one rounded Dash
2:08:26
full oops let's not misspell rounded so rounded Dash full like that absolute
2:08:35
top-0 right dash zero Shadow Dash SM
2:08:40
like this and let's also give it a type of button like this there we go so now
2:08:46
we have a nice little um uh x button right here so if I click
2:08:52
there we go we can upload a different image for example great so you have uh
2:08:58
successfully created this image upload and now what we can go ahead is we can
2:09:04
expand this entire thing and I'm gonna go ahead and open my um console and I'm
2:09:10
gonna write code with Antonio here and I'm gonna go ahead and click create and
2:09:16
there we go you can see that I have my name let me just zoom in so I have my name and my image URL and I'm gonna send
2:09:23
both of these things on the server uh sorry on the API and then we're gonna create our first server model great
2:09:30
great job so now let's go ahead and let's actually send this information to the API so I'm
Server creation API
2:09:38
going to close some stuff here and you can close your upload thing inside and
2:09:43
what I want to do is I want to go ahead and I'm going to open a new terminal so I can start npx Prisma Studio like this
2:09:52
so let me just zoom out so you can see MPX Prisma Studio like that great and
2:09:58
inside right now I only have this one profile but what I want to create create
2:10:05
now is This Server which currently says zero and if I visit you can see that it's actually zero so
2:10:11
let's go ahead and let's modify our initial model to actually uh call this
2:10:17
API route uh before we can do that let's go ahead uh and let's actually install a
2:10:24
package so I'm going to close this and I'm just going to write npm install axios like this so just make sure you
2:10:31
have that and I'm going to start my app using npm run Dev again great so I will
2:10:36
just refresh my application here and let's go inside of our components models initial model uh right here great and
2:10:45
now let's find the on submit function which currently just logs our values
2:10:50
here so let's go ahead and let's turn this into a try and catch block let's
2:10:57
resolve the error here first so for now all we're going to do is log this error
2:11:03
right here and in the try let's go ahead and use a weight axios and let's go
2:11:08
ahead and let's import axios from axios like this
2:11:14
and what we are going to call is axios dot post
2:11:20
slash API slash servers like this and pass in the values like
2:11:27
this great after that succeeds we're gonna do form dot reset we're gonna do
2:11:34
router but before we can do router we actually have to add that hook so just
2:11:39
above the state at const router to be used router from next slash navigation
2:11:44
so make sure you don't accidentally import it from next slash router so next
2:11:50
slash navigation like that and now go ahead and call router dot refresh like
2:11:56
that and window.location.refresh
2:12:01
like this great my apologies not refresh reload there we
2:12:07
go great so let's go ahead and let's create this slash API slash servers route so
2:12:14
let's go back inside of our app folder inside of API and create a new folder
2:12:21
called servers like that and inside go ahead and create
2:12:27
route.ds file like this great and before we continue Building inside I'm gonna
2:12:34
create a little util which we're going to use across all of our routes and server components to check the current
2:12:41
profile so let's go inside of our label folder and create a new file current
2:12:49
Dash profile dot TS like this inside of the slip current profile I'm
2:12:56
going to import out from clerk next JS and I'm going to import DB from dot
2:13:03
slash DB but I'm going to replace it to slash lib like this I'm going to export the constant current
2:13:10
profile which is an asynchronous function like that
2:13:15
I'm going to go ahead and call user ID from out like that
2:13:21
if there is no user ID I'm going to return now for the current profile meaning that we cannot find the current
2:13:28
profile and if there is a user ID I'm going to write const profile to be
2:13:34
awaitdb.profile dot find unique like that where
2:13:40
user ID like this and just return the profile like that great so now that we
2:13:47
have that current profile inside of our lib folder we can go back inside of our route which is located inside of the app
2:13:54
folder API servers route and let's go ahead now and let's import all the
2:13:59
necessary things we need so let's go ahead and import this current profile
2:14:05
from add slash label current profile let's go ahead and let's import DB from s slash libdb like that great and let's
2:14:14
write export const async function post like that we're just going
2:14:20
to take a request like that my apologies so not a constant just announcing this function so export
2:14:26
asynchronous function post like that let's open a try and catch block and let's resolve the error first so I'm
2:14:34
gonna write console.log and I'm gonna write servers host like this error so I'm
2:14:42
logging this just so it's easier for my development to know if something went wrong and that I have this indicator
2:14:49
telling me okay I know what file this is now and this is where I have to debug and let's just return new next response
2:14:57
which you can import from next slash server and let's go ahead and pass internal error like that with a status
2:15:05
of 500 like that great now let's go ahead and let's extract
2:15:12
the name and image URL from our body in
2:15:17
order to do that we are going to use a weight request.json and execute that like this
2:15:23
great now let's get the current profile so const profile is equal to await
2:15:28
current profile which we imported like that great if there is no profile in
2:15:34
that case return new next response unauthorized with a status
2:15:41
of 401 like this great and if there is a
2:15:47
profile we can go ahead and we can create our first server but before we can do that let's install one more
2:15:54
package so I'm gonna go inside of my terminal I'm going to shut down my app and I'm going to write MP install uuid
2:16:00
like this great and let's go ahead and let's import the uuid at the top so
2:16:07
we're going to use import the structure V4 as uuid V4 from uuid like this and we
2:16:17
also need to install the types so let's go ahead and I'm just gonna zoom out a
2:16:22
bit so you can see it in one line AMPM install Dash capital d add types slash
2:16:28
uuid like this and after you install that this error
2:16:34
should go away so we installed uuid and we installed a Dev dependency of types
2:16:40
slash uuid great and you can go ahead and run your application again and just
2:16:45
refresh your localhost here great so now that we have that I'm also going to move the next server to the top let's go
2:16:53
ahead now and let's actually create our server here so cons the server is going
2:16:58
to be awaitdb.server dot create like that and
2:17:04
data is going to be profile ID to be profile dot ID which we just fetched
2:17:11
name is going to be name so you can either write name name or you can use the shorthand operator like this same
2:17:17
thing for image URL invite code is going to be randomly generated so uuid V4 and just execute
2:17:25
this and make sure it's imported like this great so now we have a unique
2:17:30
invite code for this server and let's go ahead and let's create the initial channels so channels open an object
2:17:37
right create yeah open an array and let's create the
2:17:44
channel so name of the channel is going to be General like that and profile ID of the Creator is going to be profile
2:17:50
dot ID like that great and the same way we created channels let's also create
2:17:56
the members so members create open an array and the first
2:18:03
member inside is going to be profile ID profile dot ID and their role is going
2:18:09
to be member role which you can import from at Prisma slash client so let me
2:18:15
show you that there we go make sure you have this imported so member roll from add Prisma slash client this is in our
2:18:22
Prisma schema and use member role dot admin like this there we go so our
2:18:28
initial member who created this server is going to be assigned as an admin of
2:18:34
that server great and then we can go ahead and return
2:18:39
next response the Json server like this great and now let's go back inside of
2:18:48
our initial model which is in components models initial model right here and
2:18:54
let's see what happens what I think is gonna happen is we're going to successfully create our server but we're
2:19:00
gonna get a 404 page after that and I'm gonna explain why in a second so I'm
2:19:05
gonna upload an image from my YouTube channel right here I'm going to name
2:19:10
This Server code with Antonio like that and let's click create
2:19:16
and let's see if this is going to work so it's refreshing and there we go it's we are at a 404 page but let's check our
2:19:23
Prisma studio and let's check if our server has been created there we go we have a working server with invite code
2:19:30
profile ID you can see how it has a member right here and that member is a
2:19:36
type of admin you can see the channels it has a channel relation and that Channel's name is General you can see uh
2:19:44
the profile relation you can see the image URL from upload thing the name everything in this Prisma studio is
2:19:50
completely fine and now why are we getting this 404 error well for in order
2:19:56
to explain that we have to go inside of our app folder inside of our setup
2:20:01
folder page.tsx so remember what we are doing here we are getting the initial
2:20:07
profile so we are either creating it or we are getting the current user and if
2:20:12
we have a profile we attempt to find the initial server that this user is in if
2:20:19
there is no server we return an initial model to create one otherwise we
2:20:24
redirect to the URL of that server so that's why we are getting a 404 error
2:20:30
right here because this page right here does not exist if you check the URL you can see it's at s slash servers and the
2:20:37
ID of that server so our next step is to create a view which can render the
2:20:42
current server that the user is in so let's go ahead and let's create this
Navigation sidebar
2:20:48
page right here so where I'm gonna go is I'm gonna close everything and I'm gonna go inside of my app folder and I'm going
2:20:55
to create a new organizational route called main like this and inside I'm
2:21:01
gonna go ahead and I'm gonna create a new routes organizational folder and inside
2:21:08
I'm gonna create another folder called servers like this and inside I'm going
2:21:14
to create another folder in Brackets server ID like this and inside of that
2:21:20
I'm gonna add page.dsx like this so this is our route
2:21:27
so main routes servers server ID and let's go ahead and let's call This
2:21:33
Server page like that with a div server ID page like this and
2:21:39
let's just rename this from server page to server ID page it doesn't matter for the functionality but I think it's good
2:21:46
that we are consistent great so now we no longer have that error
2:21:51
now let's go ahead inside of our organizational main folder right here
2:21:56
and besides it having this routes folder it's also going to have a file
2:22:02
layout.tsx like this so let me show you how this looks so we have a main organizational folder we have the routes
2:22:09
organizational folder and outside of that we have layout.dsx inside of that
2:22:15
main folder so let's go ahead and let's write a main layout like that
2:22:21
it's going to be an asynchronous function let's go ahead and destructure
2:22:26
the children and let's give this children a type of of children to be
2:22:32
react.react node like this and let's go ahead and let's create a div with the
2:22:39
class name of H dash full like that and let's just render the children inside
2:22:45
and then our text should appear back on the site great now Above This children
2:22:52
let's create a div with a class name of hidden and the Plex H dash full W Dash
2:23:03
open square brackets 72 pixels z-30 black stash call fixed and
2:23:13
inset-y-0 like this and let's go ahead and let's wrap our
2:23:19
children inside uh of a main element like this
2:23:27
and let's go ahead and give this a class name of mdpl Dash open square brackets
2:23:34
72 pixels h Dash pool like this great and now I'm
2:23:41
going to expand my screen and there we go you can see how now my content has moved a bit to the right so make sure
2:23:47
that when you're developing this you zoom out enough so that you can see this being separated from this corner right
2:23:55
here if you zoom in it's going to jump into Mobile mode and it's not gonna render our sidebar so yes this is going
2:24:01
to be completely responsive I forgot to mention that uh so just make sure that you're seeing a bit of a space between
2:24:08
server ID page and this corner right here so you know you're working in
2:24:13
desktop mode what they have to build now is the navigation sidebar so I'm gonna add navigation sidebar right here
2:24:22
and if I save of course I'm gonna go I'm gonna get an error so let's go ahead and
2:24:28
let's add that so inside of our components create a new folder called navigation like this and inside create a
2:24:35
new file navigation Dash sidebar dot TSX like this so I'm just gonna expand this
2:24:43
a little bit so you can see the name so navigation Dash sidebar dot DSX like
2:24:48
this great let's go ahead and let's export const navigation sidebar like
2:24:54
this and let's just return hey there same navigation
2:24:59
sidebar like that and now we can go back inside of our app folder Main
2:25:05
layout.esx and we can import the navigation sidebar from add slash components slash navigation slash
2:25:12
navigation Dash sidebar like this and if you save the error should be gone just
2:25:18
remember to expand your page a bit and there we go you can see that now we have this mushed text so this one says
2:25:24
navigation sidebar and this one says server ID page great well let's go ahead and let's go back
2:25:30
inside of our navigation sidebar which we just created inside of this components folder inside of the navigation folder and let's start slowly
2:25:37
developing this so this is going to be a server component so let's make it a synchronous right here and let's go
2:25:43
ahead and let's fetch the current profile so const profile is going to be a weight current profile from add slash
2:25:50
lib slash current profile like this if there is no profile you're going to
2:25:55
return redirect from next slash navigation to slash like this great so
2:26:01
I'm just going to separate this through like that great now let's go ahead and let's find all the servers that this
2:26:08
user is a part of so const service is going to be awaitdb.server that find many like that
2:26:14
and I forgot to import DB so let's go ahead and let's import
2:26:20
DB from add slash lib slash DB like that and inside of this find menu let's write
2:26:27
where members like this sum
2:26:32
profile ID is equal to profile dot ID like that great
2:26:38
uh and now let's go ahead uh and let's start is styling this sidebar so I'm
2:26:44
gonna go ahead and I'm gonna add a class name to this div right here so class name it's going to be space Dash Y dash
2:26:52
four Flex Flex Dash call items Dash Center H dash full
2:27:00
backslash primary W Dash full dark is going to be BG Dash
2:27:07
open square brackets hashtag one e one F
2:27:13
two two like that mpy is gonna be three like this great so now you can see how I
2:27:19
have a nice little uh dark sidebar right here again just expand your screen a bit if you're not seeing it because if you
2:27:25
collapse too much it goes into Mobile mode okay now that we have that let's go
2:27:32
ahead and let's create a navigation action uh component so
2:27:38
in order to do that we're gonna have to install a package from chat CN so let's
2:27:43
go ahead and let's find our tooltip component
2:27:49
so let's find it right here it's tooltip so it's all the way down and we have to
2:27:55
run this Command right here to edit so I'm gonna copy it for npm like that
2:28:01
I'm gonna shut down my app and I'm gonna go ahead uh and I'm gonna shut down this
2:28:07
as well so npm npx chat scene UI at latest add tooltip like that and just
2:28:14
press enter and confirm this installation and while we are here let's
2:28:21
also find the separator so go ahead and below the select I have the separator
2:28:26
right here and we're gonna add it as well because we need it so this Command right here
2:28:33
UI at latest add a separator and press enter and confirm the installation of
2:28:40
this components after that you can go ahead and empty and run Dev your application I'm gonna refresh this right
2:28:47
here and I'm just gonna collapse it a bit so it's still make sure always the navigation is visible because that's
2:28:52
what we are working with now uh great and now so remove this navigation
2:28:58
sidebar text and add the navigation action component which right now does
2:29:04
not exist and we're gonna get an error so let's go inside of this navigation folder inside of components
2:29:10
and find a new file navigation Dash action.esx like this
2:29:16
Market is used client like that and let's go and Export cons navigation
2:29:22
action like that and let's go ahead and return a div sync
2:29:28
action let's go back to our navigation sidebar in the same folder and let's
2:29:34
import navigation action from dot slash navigation action and I'm gonna separate
2:29:39
this even more because it's a relative import here there we go now it says action in this sidebar now let's go back
2:29:46
and let's start styling it a bit so what I'm going to do is I'm going to add a
2:29:52
button inside of this div I'm gonna go ahead and create a div inside with a
2:29:58
class name of flex nx-3 H dash open square brackets
2:30:05
48 pixels like that W Dash 48 pixels like that rounded Dash
2:30:14
oops wrong that Dash 24 pixels so half
2:30:19
of this width and let's go and give it group Dash hover like this to be rounded
2:30:26
Dash open square brackets 16 pixels like this
2:30:33
transition Dash all overflow Dash hidden
2:30:39
items Dash Center like this we're also going to need to add justify
2:30:46
Dash Center BG Dash background dark BG Dash neutral Dash 700 group Dash
2:30:57
hover BG Dash Emerald Dash 500 like this
2:31:02
great and inside of this div we're going to add 8 plus
2:31:08
from Lucid react so make sure you import this and let's go ahead and let's give
2:31:13
that a class name as well of group Dash hover text Dash White
2:31:20
transition and text Dash Emerald Dash 500 like this
2:31:26
and let's give it the size of 50 like that
2:31:31
there we go sorry not 50 25 like this there we go so now you have a nice
2:31:37
little plus icon but when we hover nothing is happening so we have to go back inside of this button right here
2:31:43
and let's give it a class name of group and now when you try and hover
2:31:49
you can see that we have this nice little effect right here great alongside
2:31:54
group we're also going to add eight flags and items Dash Center inside great
2:31:59
great job now let's go ahead and let's create our action tooltip component so
2:32:06
we're going to use that that when we hover it's going to explain what this action does so let's go inside of our
2:32:12
components and create a new file action Dash tooltip.dsx so this one right here great
2:32:20
let's mark this as use client like that let's import everything we need from the
2:32:26
tooltip well actually we cannot import any oh we added the tool that my apologies so import tooltip
2:32:33
tooltip content cool tip provider and tooltip trigger
2:32:42
from s slash components action tooltip my apologies UI tooltip
2:32:52
like this great so tooltip toolted content provider and Trigger from
2:32:57
components UI tool tip like that great let's create an interface action toolkit
2:33:02
like that so action toolpit props label is going to be a string children are
2:33:08
going to be react.react node like this side is going to be optional and the
2:33:15
values are going to be top start bottom
2:33:21
and left and instead of start we're going to write write my apologies
2:33:26
and the Align is also going to be optional with props start
2:33:32
Center and end like this great and let me just replace this commas with
2:33:39
semicolons and now let's actually build this component so export const action
2:33:44
tooltip like this let's go ahead and let's destruct label children side and align let's map them
2:33:53
to this prop so action tool tip props like that
2:33:58
and let's go ahead and return this and let's return a tooltip provider
2:34:06
which we imported let's add the tool tip let's give it a delay
2:34:13
duration of F50 and let's give it a tool tip trigger
2:34:19
like this we're just going to render our children and let's give this tooltip
2:34:25
trigger a prop as child like this and inside just below the tooltip trigger
2:34:32
let's add the tool tip content like this let's give it a side prop
2:34:39
which matches to our side prop and the same thing with a line so it's not going
2:34:45
to be a string but our align prop like that and inside we're going to render a
2:34:51
paragraph which is gonna write the label dot to lower case like this and then we
2:34:57
can give this paragraph a class name a font semi bold text SM and capitalize
2:35:03
like this great so now let's go back to our navigation action component inside
2:35:10
of this navigation folder inside of components and let's go ahead and let's
2:35:15
import action tooltip from dot dot slash action tooltip or I'm gonna replace the two
2:35:22
components action tooltip like this and let's go ahead and let's wrap this uh
2:35:27
button around uh with action tooltips so action tool tip like this all we have to
2:35:34
do is wrap the button like this and indent it and let's go ahead and let's
2:35:40
pass in the necessary props the side is going to be right a line is going to be
2:35:45
Center and label is going to be add a server like this and save this file and
2:35:52
now when you hover you have a beautiful tooltip so let me just expand this a
2:35:57
little bit and let me zoom in so when you hover you have a beautiful add a server tooltip so that's exactly what we
2:36:05
wanted to develop great so what I'm gonna do now is I'm gonna go
2:36:12
ahead and so obviously this button is gonna trigger a model which is gonna
2:36:18
enable us to create more servers but before we do all that let's actually start rendering uh our active servers
2:36:26
that we are a part of so I'm going to close everything so it's easier for us let's go back to components navigation
2:36:33
to navigation sidebar component and after navigation action let's add a
2:36:39
separator which we added so make sure you don't accidentally import it from Radix make
2:36:44
sure you import it from dot dot slash UI slash separator so let me show you how
2:36:49
your import is supposed to look it's supposed to look like this but I'm Gonna Change it to add slash components slash
2:36:56
UI separator and I'm going to move it to the top right here now let's modify this separator a bit by
2:37:03
giving it a class name and the class name is going to be h-2 pixels like that BG sync 300 dark
2:37:13
BG sync 700 rounded Dash MD like this
2:37:20
w-10 and mx-auto like this so these are the classes for our separator great so
2:37:26
you can see how now it looks a little bit better uh great now what we're gonna do is we're gonna add another component
2:37:33
from chat CN called scroll area so let's go ahead and expand this and let's find
2:37:39
our scroll area right here let's find uh the CLI installation so npx chats
2:37:46
Indiana latest scroll area I'm gonna go inside of my terminal and I'm gonna paste that here let me just expand this
2:37:52
so you can see it in one line so MPX chat cnui at latest add scroll area and
2:37:58
let's press enter and let's confirm this installation now let's go ahead and run
2:38:04
our application again I'm just going to expand my screen so my sidebar is visible and I'm going to
2:38:10
refresh my Local Host great below this separator add a scroll area and import
2:38:16
it from dot dot slash UI slash scroll area like this and let me show you this
2:38:23
import so I'm just going to replace it to slash components slash UI and I'm
2:38:28
going to move it right here so this is how it's supposed to look in one line scroll area from add slash
2:38:35
components UI scroll area great let me just change this back so it's
2:38:40
visible and inside of the scroll area well before we put anything inside let's just give it a class name
2:38:48
of flex 1 and W full great and what we're going to do inside is we're going
2:38:54
to render these servers that the user is a part of so let's go ahead and let's
2:39:00
run servers.nap server and let's go ahead and for now let's
2:39:06
just do a div let's give it a key of server.id so we fix that error and let's
2:39:13
go ahead and let's just render server.name inside
2:39:18
and there we go now it says code with Antonio for me here because I am in that
2:39:24
server great now instead of rendering that we're actually going to render a
2:39:29
navigation item which is going to render our server great so let's go ahead and
2:39:36
let's do that so I'm going to replace this server name with navigation item
2:39:42
like that and if we save we are going to get an error before we fix this error
2:39:47
let's go back to this div and just give it the class name of margin bottom for like this let's go back inside of our
2:39:54
components find navigation folder and create a new file navigation Dash item.dsx like this great let's go inside
2:40:03
let's mark this as use client like that let's import image from next slash image
2:40:10
like this let's import use params and use router from next slash navigation
2:40:20
let's import CN from add slash lib a utils and let's import the action
2:40:27
tooltip which we created from dot belt slash action tooltip but I'm going to replace it to slash components action
2:40:33
toolkit great now let's go ahead and let's create an interface so interface navigation item
2:40:41
props are going to be ID which is a string image URL which is a string and
2:40:47
name which is a string like this great now let's go ahead and let's write
2:40:52
export const navigation item let's extract all of those so ID image
2:40:59
URL and name like this and let me just confirm okay make sure this is marked as use client I just wanted to confirm that
2:41:06
and let's map these props to navigation item props like that and let's go ahead
2:41:12
and let's return a div same server like this let's go back to our navigation
2:41:18
sidebar where we render the navigation item and let's import it so navigation item from dot slash navigation item and
2:41:26
we can leave it like this just below the navigation action great now let's go
2:41:31
ahead and let's actually give it the props it needs so I'm gonna go ahead and give it an ID of server.id I'm gonna
2:41:39
give it a name of server.name and I'm gonna give it an image URL of
2:41:44
server.image URL like this there we go so I can see a small text saying server
2:41:50
right here so let's go back inside of this navigation item and we're gonna go
2:41:55
ahead and start by wrapping this entire thing into a tooltip so action tool tip
2:42:02
like this and let's just add back this the same server and let's go ahead and let's give
2:42:10
it a side of right let's give it an align of Center and let's give it a
2:42:16
label of the server name like this so when you hover it says code with Antonio
2:42:21
so that's the server that we are going to click on great let's replace this div
2:42:26
with a native button element like this and let's go ahead and let's give it an
2:42:32
on click of an empty Arrow function for now and a class name group relative Flex items
2:42:40
Dash Center like this and inside we're going to replace this with a div and this div is going to have
2:42:48
a class name which is not going to be a string but a dynamic class using CN
2:42:53
which we imported right here from lab utils so let's go ahead and open this
2:42:59
function in the first parameter I'm gonna give it an absolute left bash 0 BG
2:43:06
Dash primary rounded Dash R Dash full transition Dash o and W-4 pixels like
2:43:15
this then I'm gonna go ahead and add the parameters so go ahead and add const parents from
2:43:24
use parents which we have imported right here alongside the user router from next
2:43:29
slash navigation so below that we can also add a router like that and now let's add changes to
2:43:38
this div depending on the if the server ID is clicked on or not so if param's
2:43:43
question mark server ID is not equal to ID in that case group Dash hover will
2:43:50
change the height to 20 pixels otherwise so let me just expand this
2:43:56
just a little bit so you can see it in one line okay
2:44:01
Rams question mark the server ID is equal to ID in that case we're gonna do
2:44:08
height 36 pixels
2:44:13
like that and this is not going to be an end and sign my apologies this should be a
2:44:19
question mark like this so if we are on server uh we're gonna have this height
2:44:25
otherwise height is going to be 8 pixels like this all right so let's see what we've done
2:44:32
so I'm going to move I'm going to write server back in here and let me just expand this and zoom
2:44:38
back in and there we go you can see that now I'm having this little white bar which
2:44:45
doesn't make too much sense now but it's gonna make once we add some more things here uh okay
2:44:52
and also uh you can remove This Server inside and this div is going to be a
2:44:57
self-closing div so you can just do this like that there we go great now below
2:45:02
that let's go ahead and create a new div also with the dynamic class name using CM let's give it some default classes so
2:45:11
relative group Plex mx-3 h-48 pixels like that W Dash
2:45:20
48 pixels rounded Dash 24 pixels
2:45:26
group Dash hover
2:45:31
rounded Dash 16 pixels like this
2:45:37
transition Dash all and overflow Dash hidden like this now let's write some
2:45:44
Dynamic classes so Rams question mark dot server ID is equal to ID in that
2:45:50
case BG Dash primary slash 10 tax Dash primary and rounded
2:45:58
Dash 16 pixels like this great and inside we're gonna render an image from
2:46:06
next slash image so make sure you have that imported right here image from next slash image
2:46:14
we're gonna add the fill prop the source is going to be image URL from our props
2:46:19
and ALT is going to be Channel like this so let me just expand this
2:46:27
and there we go you can see that I have my code with Antonio server right here great and you can't really see right now
2:46:36
but when we add more servers you're gonna see some nice animations with this little white bar here and it's going to
2:46:42
expand like this button here when we hover over inactive service great great
2:46:48
job so you finished that and now let's just add an on click function here so
2:46:54
const on click whoops let's do a proper Arrow function
2:47:00
to be router.push add backticks slash servers slash ID
2:47:06
like this and let's add this on click to this empty Arrow function like this so when
2:47:14
we click on one of these icons in the sidebar we are going to load that specific server we are already in here
2:47:20
so nothing is happening great so we are done with the navigation item let's go
2:47:25
back to navigation sidebar what we have to add next is our user button and our mode toggle
2:47:33
so outside of this scroll area go ahead and create a new div go ahead and give it a class name of
2:47:41
padding bottom 3 margin Top Auto Flex items Dash Center like this Flex Dash
2:47:49
coal and GAP Dash Y dash four let's render the mode toggle we already have
2:47:55
that we we invented that when we added dark and light mode so you can import
2:48:00
that from dot dot slash mode toggle so let me show you there we go dot dot slash mode toggle I'm Gonna Change it to
2:48:07
slash components mode toggle and I'm gonna move it along with my other components great so we have the mode the
2:48:14
toggle and below that add the user button from add clerk slash next Js so
2:48:21
just like this user button and I'm gonna move this import with all the other Global Imports like this and let's go
2:48:27
ahead and let's add after sign out URL to be slash like this and let's change
2:48:34
the appearance elements Avatar box
2:48:39
to be h-48 pixels and w-48 pixels as
2:48:45
well so it matches the size of or of our other servers there we go so now we can
2:48:51
change the mode from here as well great and you can also click on this icon to
2:48:56
log out and if we didn't have this appearance prop and you can see that it will look much
2:49:01
smaller so this way It just fits our content inside and make sure you refresh
2:49:07
this before you try the log out because of this after sign out URL great so what
2:49:13
we have to do next is when we click on add a server we have to open a similar model like that initial model uh to
2:49:21
actually create a new server let's go ahead and let's create this action that when we click on this button
Create Server Modal
2:49:28
to add a server a model opens up and we can do the action we did a bit before
2:49:34
this before we head there I just want to do one click modification uh for this
2:49:39
light and dark mode toggle so I don't like that this has such a dark background as opposed to this sidebar
2:49:46
right here so let's go inside of the mode toggle button which is inside of
2:49:52
our components mode toggle right here and in this button right here I just
2:49:58
want to give it a class name of VG Dash transparent like this and
2:50:04
Border Dash zero like that and now if you go ahead and look how it looks there
2:50:10
we go it seems to be much more Blended in uh and it's not that noticeable see
2:50:16
there isn't like a visible uh color around it except when we hover which is completely fine we want that indicator
2:50:22
uh great now let's go ahead and let's install a package called to stand so we
2:50:28
can work with our models so npm install to stand right here and once this is
2:50:35
done I want to go ahead and I want to add actually we already have the dialog because we have a model so you can just
2:50:42
go ahead and run the application and what we're going to do now is we're going to create our model store so let's
2:50:49
go ahead and close everything here and let's go and create a new folder oops a
2:50:56
new folder uh outside of our components outside of our app so just a complete new folder called hooks like this and
2:51:04
inside of the hooks let's go ahead and create a new file use Dash model Dash
2:51:09
store dot DS like this so we're going to use this hook to control all models in
2:51:15
our in our application so let's go ahead and import create from to stand like
2:51:21
this and let's go ahead and let's export type model type
2:51:26
and in here we're gonna hold all possibilities of our models and the first one is going to be create server
2:51:34
like this so later we're gonna expand this with types like edit server
2:51:39
uh create channel and stuff like that but no need to add that now I just want to
2:51:45
show you an example of how that's going to look for now it's going to be just this great now let's create an interface
2:51:52
model store like that we're going to have a type which is model type or null
2:51:59
like this we're also going to have is open which is a Boolean we're gonna have
2:52:05
on open which is going to be a function which accepts the type so we direct what
2:52:11
type of model we want to open like that and just return a void like this and I
2:52:18
made a typo so it's model type not model there we go and we're also going to have
2:52:23
on close which is just a void function like this great now let's go ahead and let's export const
2:52:31
use model create model store for the typings go ahead and
2:52:38
open this function go ahead and open another function and let's just go ahead and immediately
2:52:44
return an object and let's add all of this types from the store so type by
2:52:50
default is going to be null is open is going to be balls on open
2:52:57
it's going to accept a type and it's going to call a set
2:53:02
it's going to change the is open to true and it's going to set the type of the
2:53:07
opened model and we're gonna have on clothes we're just gonna call set
2:53:13
it's going to return the type to null and it's going to call is open to be balls like this great now that we have
2:53:21
that let's go ahead and let's create our create a server model so I'm gonna go
2:53:27
ahead inside of my components inside of models right here and you can copy and paste this initial model and just rename
2:53:35
it to create a server model like this great so let's go ahead and let's change
2:53:41
the name of initial model just make sure that you are inside of create server model file
2:53:46
and let's change this to create server model like that we are no longer going to need this is mounted thing so you can
2:53:53
remove that you can remove this use effect and you can remove this if is
2:53:59
mounted return now like that and you can also remove this react import we are not
2:54:05
going to need that because we're going to handle that in AIM model provider great so now let's go ahead and let's
2:54:12
see what we have to change uh from this uh on submit function so
2:54:18
inside we no longer need this window.location.reload so we can remove
2:54:24
that like this and everything else can actually stay the same except this
2:54:30
hard-coded open so for that we're gonna need to add our uh use model hook so
2:54:36
let's go ahead and let's go above the router and add const
2:54:41
unless the structure is open on closed and tight prom use model from add slash hooks
2:54:49
Slash use model store so it's this import which we just created here and
2:54:55
let's see how that looks so there we go export const use model right here great
2:55:00
so from here with this structured is open on close and type so first let's
2:55:05
create a constant which is going to watch whether this specific model is opened or not so const is model open is
2:55:13
going to be is open and if type is equal to create server like this great and now
2:55:20
let's replace this hard-coded open in dialog with this is model open like that great
2:55:27
now let's go ahead and let's create a custom on close function here so const on close sorry handle close
2:55:36
is going to be an arrow function which is going to reset the form and it's
2:55:42
going to call on close from this destructured props from the use model hook great and now we can go ahead and
2:55:49
add this to on open change to be whoops on open change to be this newly created
2:55:58
hook handle close like this great now let's go ahead
2:56:04
and let's create our model provider so I'm going to close everything here I'm going inside of my components inside of
2:56:12
my providers and I'm going to create a new file model Dash provider.dsx like this
2:56:18
let's mark this as use client and let's import create server model from dot
2:56:24
slash models create server model but I'm going to change it to add slash components
2:56:32
there we go so let me just expand my screen there we go so in one line create server model from add slash components
2:56:39
slash models create server model AKA this component right here great and in
2:56:46
here let's go ahead and let's export cons model provider like this and all it's going to do is
2:56:53
return a fragment and inside of this fragment we're going to render all of our models for now we just have this one
2:57:00
we also have the initial model but that one is handled in a very specific way it's rendered directly so that's why we
2:57:06
don't connect it to two stand and all uh the hooks it can work independently but
2:57:12
all the other models in our application are going to be controlled by some on clicks by some use effects and stuff
2:57:19
like that that's why we are separating them like this great and since I removed the is mounted from this create server
2:57:27
model because I said we're gonna handle that somewhere else this is where I meant so let's go ahead and let's write
2:57:32
const is mounted set is mounted use state from react
2:57:40
default value is false use effect like this
2:57:45
empty dependency array set is mounted to True like this and if we are not mounted
2:57:52
return now so what this is doing is preventing the models to be rendered on
2:57:58
the server side because that can create inconsistencies thus creating um hydration errors and keep in mind
2:58:06
whenever I write use client that doesn't mean that this component is not rendered
2:58:11
on the server so this is still a server side rendering right so don't get that confused all this means is that it's not
2:58:19
a react server component so there's a difference both react server components
2:58:25
and our use client components are in server side rendering but use client
2:58:31
also means that it's also rendered on the client and that's what causes hydration errors if there is one state
2:58:37
while it's being rendered on the server and another state when it's being rendered on the client so models are
2:58:44
problematic with that because they can be opened by use effects they can be opened by some renders they can be
2:58:50
opened by on clicks so that's why we say okay if we are doing the server side rendering we are not gonna show any
2:58:57
models at all because well they're not needed to be server side rendered it's completely fine for them to be on the
2:59:04
client only great and I'm just going to separate this too and now what we have
2:59:09
to do is we have to add this model provider inside of our root layout so
2:59:15
let's go inside of our app folder find the root layout right here and inside of
2:59:20
this team provider above the children add model Provider from add slash components slash provider slash model
2:59:27
Dash provider so just like this and let's keep these providers together so
2:59:33
I'm also going to separate this too there we go so we have the theme provider and our model provider here
2:59:39
great and now let's go ahead and let me just expand my screen so we can see the
2:59:44
sidebar again and let's actually open that model when we click on this server
2:59:50
right here so in order to do that we have to go inside of our navigation
2:59:56
action so let's go inside the components navigation and find the navigation
3:00:02
action so let me just see yeah I want you to see the name there we go navigation Dash action right here okay
3:00:11
and in here we have to add the use model hook so let's go ahead and let's write
3:00:17
cons lets this structure on open equals use model from add slash hooks
3:00:24
Slash use model right like that and then on this button right here inside of the
3:00:30
action tooltip add an on click to Be an Arrow function which holds on
3:00:35
open or I type create server like this there we go and now if
3:00:43
I click here it should open but let's see why it's not working no maybe I have
3:00:49
to refresh maybe I didn't even start the application let's see which one it is let me try again there we go so it's
3:00:54
working I just had to refresh my application great and now we should be able to create servers whenever we want
3:01:02
and not just on the initial pages so let's check that out I'm gonna click add a server here I'm gonna go ahead and use
3:01:08
an image from unsplash like this and I'm gonna name this test Server Like This
3:01:16
and let's just click create and let's see if that is going to work okay I also have to close the model so that's one
3:01:22
thing that I forgot but there we go and now if I click you can see that my URL is changing and you can see how
3:01:29
different uh these animations and styling look depending on which server is selected great so let's just fix that
3:01:36
when we create a server we actually close this model
3:01:41
so we have to go back inside of create a server model so not our initial model
3:01:47
but components models create server model so this one right here and we're
3:01:53
going to use this on close inside of this on submit so after router refresh
3:02:00
just call the on close great so let's try again I'm gonna go ahead
3:02:06
and I'm gonna upload another image from unsplash let's call this uh server 2
3:02:13
like this it doesn't really matter let's just click create and there we go so the
3:02:18
model closes and I can switch between my servers great great job what we have to
3:02:24
do now is another sidebar which is going to render our channels
Server Sidebar
3:02:31
so now let's go ahead and let's create another sidebar right here where we are
3:02:36
going to render all the servers sorry all the channels inside of a specific server as well as all the members so
3:02:44
let's go ahead and let's go and close everything and go inside of your app folder inside
3:02:51
of main routes server ID and go ahead and create a new file
3:02:57
layout.tsx like this and we're gonna go ahead and call this server ID layout
3:03:04
like that go ahead and add the children and go ahead
3:03:09
and give the types for children to be react.react node like this great now go
3:03:16
inside and just render the children like this there we go so the error is gone
3:03:22
and we have our layout right here so I'm just going to zoom this out so my
3:03:28
sidebar is visible again make sure that your sidebar is visible so either zoom out or expand your tab one of the two
3:03:35
because we are working in desktop mode for now great so inside of this server ID layout
3:03:43
besides just children we're also gonna go and add the params so every server
3:03:49
component has this prop params where you can read what is in the current URL great so let's go ahead and let's fetch
3:03:57
the current profile so const profile await current profile from s slash lib
3:04:03
current profile like this and let's turn this into an asynchronous layout there
3:04:09
we go so now we can safely use a weight here if there is no profile in that case return
3:04:16
redirect to sign in from Clark next JS and I'm just going to separate this too
3:04:22
like this great and now let's go ahead and let's find this server with this ID
3:04:29
so const server await DB import DB from
3:04:35
add slash libdb like I did right here so db.server dot find unique
3:04:42
where ID is params the server ID
3:04:48
like that so how do I know that there's going to be a server ID inside of this prop
3:04:54
params well the way I know that is because I named my folder server ID so
3:05:00
if I named my folder something else ID in that case I would search for params
3:05:06
something else ID but since it is a server ID I know that in this URL part
3:05:12
right here so this ID that is mapped to this server ID folder right here and
3:05:19
that's how I can access it and let's just go ahead and give this params a type so below children params are an
3:05:27
object with server ID as a string inside so we know that great and it's not
3:05:35
enough that we just check for the ID because this way any person that knows the ID of the server could load all
3:05:42
channels and messages for that server so we are also going to confirm that inside of its members of that server we have a
3:05:51
matching profile ID with the current profile ID which we loaded right here so
3:05:56
this way only the person who is a member of the server can actually load that server great and if there is no such
3:06:05
server so if either someone who is not from this server is attempting to load or if that server was deleted we can
3:06:13
just return and redirect to the root page and let's go ahead and let's import
3:06:19
whoops redirect from next slash navigation like
3:06:25
this great and now let's go ahead and let's give this div a class name of H dash full
3:06:33
like this let's create another div here with a class name hidden and reflex H
3:06:40
dash full w-60z-20 Flex Dash coal and inset Dash Y
3:06:49
dash zero like this great and let's just wrap the children inside of a main
3:06:57
element like this and let's give them a class name
3:07:03
h-4 and mdpl-60 great so now we have to expand
3:07:11
even a bit more to see our children is that true okay so either right here okay
3:07:16
uh we're gonna see uh what's up with that but I think it's just because of the way uh we are developing right here
3:07:24
oh actually I think I know what it is I think I forgot to add fixed to this class names right here so let me just
3:07:31
expand this a bit so we have a hidden mdflex H full w60z20 Flex call an after
3:07:38
Flex hole I actually want to put fixed and then inset y0 and there we go so now
3:07:44
it works so now you can see that I have a sidebar right here and then I have another space and then I have my content
3:07:51
so in this new space here we're going to render our channels our members and
3:07:57
stuff like that great so make sure you have these classes in this div we're gonna have these servers uh sorry the
3:08:06
server sidebar like this so what now when I expand there we go we have our navigation
3:08:12
sidebar here here we're gonna have our server sidebar and here we're gonna have the actual chat application great cell
3:08:19
of course instead of saying uh server sidebar here we're actually gonna need
3:08:25
to render the server sidebar component so save this and we're gonna get an
3:08:32
error so let's go ahead and let's fix this error by going inside of our components
3:08:39
create a new folder called server and inside create a new
3:08:44
file server Dash sidebar dot DSX like this great and let's just export cons
3:08:51
the server sidebar and let's just return a div saying
3:08:57
server sidebar component so we know it's coming from here let's go back inside of
3:09:03
our app folder main routes servers server ID layout and let's import this
3:09:09
from add slash component slash server slash server sidebar like I did right
3:09:15
here and I'm just gonna order those like that great so now if I save you're gonna see that no more errors are shown and
3:09:22
now I have this text saying server sidebar component right here great
3:09:28
okay and now we have to go inside of This Server sidebar and we actually have
3:09:34
to start uh rendering some stuff inside so before we continue that we have to go
3:09:41
back inside of our layout inside of this server ID right here so let me just
3:09:47
expand this so inside of this server ID layout and one thing we have to pass the
3:09:52
server sidebar is the server ID so let's go ahead and let's write server ID to be
3:09:59
params.server ID like this great and now we can head back inside of our
3:10:04
components server server sidebar right here and let's write an interface
3:10:11
server sidebar props this is gonna be
3:10:17
um so server ID is going to be a string like that great and now we have to
3:10:23
assign these props to the actual component and make sure this is an asynchronous component
3:10:29
and it's going to be of course a server component so let's write server sidebar
3:10:35
graphs like that now let's go and fetch the current profile again so const
3:10:40
profile is equal await current profile from s slash lead current profile if
3:10:46
there is no profile in that case return redirect from next slash navigation to
3:10:52
slash like that great and let's just separate this too and now let's fetch
3:10:57
This Server again so the reason I'm fetching it both inside of the layout right here is because we're going to use
3:11:04
this server sidebar component in one more place and that's going to be the mobile sidebar which is not going to
3:11:10
have access to this layout so I want to make this server sidebar component independent and only needed this server
3:11:17
ID so I can fetch the server inside one more time great so let's use con server
3:11:22
to be await db.server and let's actually just import DB from
3:11:28
at slash lib slash DB like this so DB dot server dot find unique like that
3:11:37
and inside of here I'm going to look for where ID is server ID like that and now let's
3:11:45
go ahead and include a bunch of stuff that we need here so we're gonna need
3:11:51
all channels so let's include the channels and let's order by creative at
3:11:56
ascending like that great besides channels we're also going to need to include the members
3:12:03
like that and we're also gonna need to include each member's profile so we can load their image their name their email
3:12:10
and stuff like that and let's order them also by a role ascending so we're gonna
3:12:16
show uh the admins first then the moderators and then the guests great and
3:12:23
now below that so after we load this server right here let's go ahead and let's uh separate
3:12:31
text channels audio channels and video channels in their own constant so const
3:12:36
text channels are going to be server question mark Dot channels.filter
3:12:42
we're gonna find the individual Channel and let me just expand my screen as much as I can
3:12:48
we're going to find the individual Channel and we're gonna check whether the channel DOT type
3:12:55
is equal to channel type which you can import from at Prisma slash client so
3:13:01
this is what I imported right here and let me just organize this Imports so I'm going to keep these two
3:13:07
at the top and this one at the bottom so I imported Channel type from at Prisma slash client
3:13:12
so we're going to check whether this channel type is text like this and let me zoom out a bit so you can see how
3:13:18
this looks in one line so cons text channels we are looking for all the channels and only filtering those which
3:13:25
have the text type and I'm going to copy this two more times the second one is going to be audio channels
3:13:32
right and this one is going to check for channel type audio and this one is going to be video
3:13:37
channels and this one we're going to check for type video like this great so
3:13:43
let me just zoom in back so there we go we have text channels checking if the channel type is text audio channels
3:13:49
checking for audio and video channels checking for video like that great
3:13:55
and let's also get our members circumst members are going to be server question
3:14:01
mark dot members dot filter individual member and let's
3:14:06
just filter out ourselves so no need to show ourselves in the list member.profile ID
3:14:13
is not equal to profile dot ID like this great so I'm going to zoom this back so
3:14:20
you can see how it all looks in one line like this so text channels checking for text audio checking for audio video for
3:14:26
video and members we filter throughout all the members and remove the ones which is ourselves because this profile
3:14:33
dot ID comes from the current profile here great and make sure you don't
3:14:39
accidentally do profile ID so it's lowercase and if you do it it's gonna throw you an error so it's I lowercase D
3:14:47
profile ID like this great and now let me Zoom back in and let's just do a redirect if there is
3:14:54
no server so return redirect the slash like that and now let's find our role
3:15:02
inside of This Server so whether to check if we are an admin if we are a
3:15:08
moderator or a guest so constant role is going to be server dot members dot find
3:15:14
individual member member.profile ID is identical to our
3:15:21
profile.id if it's found so question mark dot roll
3:15:26
like this so again I'm going to zoom out so you can see how this looks in one line so we look through all of the
3:15:32
members and we search for our matching profile ID which means okay we found the
3:15:37
member and once we found it let's check the role so the question mark is here because if you remove it there is a
3:15:43
possibility that we just don't find ourselves in the list of members that
3:15:49
should never happen but still we have a question mark here to confirm that
3:15:54
great and now that we have that that's actually nothing else we have to load so
3:16:00
let's go ahead and let's give this div a class name so I'm gonna zoom in back so class name for this div is going to be
3:16:07
Flex Flex Dash call H dash full text Dash primary W Dash full
3:16:15
on dark we're going to use a background of this hex code to be uh to the three
3:16:24
one like that otherwise we're gonna use a background of f to F3 F5 so depending
3:16:34
on whether we are light on dark mode we're gonna change the background so let's see how this looks there we go and
3:16:39
if I change the light mode you can see how it looks a bit different great so exactly uh what we wanted
3:16:47
perfect so yeah just keep your sidebar component open and great now let's remove these texts
3:16:53
for Server sidebar component and let's actually render our server header like this and inside of This Server
3:17:01
header we're gonna pass in the current server which we loaded and we're gonna pass in the role like this great so of
3:17:09
course we're gonna get an error for this so let's go ahead and let's resolve that
3:17:14
so we have to go inside of our components inside of server and create a
3:17:20
new file server Dash header.dsx like this great let's mark
3:17:26
this as use client like that and let's go ahead and let's create an interface
3:17:31
server other props
3:17:36
like that we need a server and we're going to need a specific type of server so we can't
3:17:43
just use the server from Prisma slash client because this server also has channels it also has members and it also
3:17:52
has profiles of those members if you look at the server sidebar look at this query right here so we included the
3:17:58
channels and we included the members so take a look at if I hover here you can see that I get all of these types here
3:18:06
and if you take a look at this server you can see that it doesn't have all of those types so what we have to do is we
3:18:13
have to create a types file and then we're going to add that here so you can
3:18:20
save this file for now the server header ignore the error for now and go ahead
3:18:26
and create a new file called types dot DS so make sure it's in the root of your
3:18:33
app so not in any folder so completely outside like this yes and let's just
3:18:39
write expert const server whoops export type
3:18:44
my apologies export type server with members with profiles like that and
3:18:54
that's going to be equal to server and open an object members
3:19:01
which is going to be Open brackets a member and
3:19:08
open an object again profile which is a profile like this so now let's import
3:19:14
server member and profile from at Prisma slash
3:19:19
client and at the end of this brackets make sure you add an array like this there we go so now we have this type
3:19:26
server with members with profiles like this and now I'm going to close
3:19:31
everything here let's go back inside of components server server header and
3:19:37
let's replace this server with server with members with profiles like that and
3:19:44
now we have the correct type for our server header great now let's write a role which is optional
3:19:50
member role like that from add Prisma slash client so that can stay the same
3:19:56
great and now let's write expert cons the server header
3:20:04
let's return a div saying server header like this and let's just extract this
3:20:10
props to server and the role and let's map This Server header props
3:20:18
to it like that great and now if you go inside of your server sidebar
3:20:24
right here you can see that we have no errors well actually we can check for
3:20:30
that because I forgot to import this so go back to your server sidebar and input the server header from dot slash server
3:20:37
header like this and I'm just going to keep those since they are in the same folder no need to do the whole add slash
3:20:44
components it's fine to keep them like this great and you can see that we have no errors here but let me just show you
3:20:51
what would happen if we didn't do this custom type so what if I just added a server here
3:20:57
and used a server well what would happen basically is that
3:21:03
there seems to be no error here but in the in this in if I try server dot
3:21:08
members here you can see that it doesn't work if I try server.channels you can see that it doesn't work as well
3:21:14
but if I use the server with members with profiles and then try the
3:21:20
server.nembers there we go now I have the autocomplete great so that's why we needed that perfect so you can just save
3:21:27
this and let me expand my screen a bit so there we go we have the server header text right here and now let's continue
3:21:33
developing so first let's add some constants so const is admin
3:21:39
is going to be roll is equal to number roll dot admin like this const is moderator
3:21:48
is going to be equal to is admin because every admin is also a moderator or role
3:21:55
is equal to member roll dot moderator like this great and now we're gonna have
3:22:01
to create our drop down menu so replace this divs with the drop down menu from
3:22:07
dot dot slash UI slash drop down menus to make sure you don't accidentally import this from Radix it's not gonna
3:22:14
work otherwise and I'm just going to replace it with Slash components like this and I'm gonna separate them for
3:22:20
those types and you can remove This Server import if you have it from Prisma client but I think you don't have it because I was just demonstrating
3:22:26
something with that great and now inside of here add the drop down menu trigger
3:22:32
from add slash components slash UI slash drop down menu so please make sure you
3:22:37
don't accidentally import things from Radix because it's going to break your Styles and you're going to be wondering
3:22:43
why is it not working well in fact it's just going to be the Radix thing so always confirm that all of your drop
3:22:48
down Imports are from slash components UI drop down menu the reason we have drop down menu is because of the mode
3:22:56
toggle for light and dark mode that's when we added this component great so inside of this trigger let's go
3:23:03
ahead and let's give it a class name of focus
3:23:09
outline Dash none and as child prop like this and inside
3:23:16
we're gonna use a button like this and we're going to give this button some
3:23:22
class names so let's go ahead and let's write last name W Dash full text Dash MD
3:23:30
font semi bold px-3 like this blacks items Dash Center
3:23:39
h-12 border Dash Mutual Dash 200 on dark mode we're going to use border
3:23:48
Dash neutral Dash 800 border
3:23:53
Dash B Dash 2 and we're also gonna have
3:24:00
hover BG Dash sync Dash 700 slash 10 but on
3:24:07
dark mode it's gonna be hover BG
3:24:13
sync Dash 700 50 and transition like
3:24:19
this great and inside we're going to render server.name so the currently
3:24:25
server that we are on and the Chevron down icon from Lucid reacts so make sure
3:24:31
you have this import I'm gonna move it to the top right here great this is a self-closing tag and
3:24:37
let's give it a class name of h-5 w-5 and ml-auto like this and let
3:24:46
me just expand my screen a bit so there we go now when I go to code with Antonio you can see how it says code with
3:24:52
Antonio when I go to test server it says test server when I go to this one it says server to great so this is exactly
3:24:58
what we wanted so I'm just gonna a zoom out like this so we can develop
3:25:04
and see this sidebar here great so now we have to create the actual drop
3:25:09
down content outside of this drop down menu trigger so add drop down menu
3:25:14
content from add slash component slash UI slash drop down menu so just confirm
3:25:20
that you have the drop down menu content from slash components not from Radix great and let's go ahead and let's give
3:25:27
this some class names so class names are going to be w-56 text is going to be extra small
3:25:35
font is going to be medium text is going to be black
3:25:40
on dark text is going to be neutral 400
3:25:46
and space Dash Y is going to be 2 pixels like this great
3:25:51
so first thing we're going to add is the option to invite people so both moderators and admins can do that and if
3:25:59
you look at our if you look at our constants here we can use the is
3:26:06
moderator to check whether the user is either an admin or a moderator so all we
3:26:12
have to do is add is moderator and and let's go ahead and write drop
3:26:19
down menu item again from s slash components UI drop down menu so just
3:26:25
confirm you have drop down menu item from components drop down menu and inside I'm gonna write invite people
3:26:32
like this and you can see how I have a small little invite people uh box right
3:26:38
here so I'm sorry this is so zoomed out but if I zoom in it's going to turn into Mobile mode and you're not gonna see
3:26:44
absolutely anything okay great so now let's go ahead and let's give this some
3:26:50
class names so class name is going to be text Dash indigo-600 dark is going to be tax Dash
3:26:58
Indigo Dash 400 like that PX is going to be 3 py is going to be two text is going
3:27:06
to be small and cursor is going to be pointer like this great so let's see that there we go so now invite people
3:27:13
looks a bit better and now let's add an icon so user plus from Lucid react make
3:27:18
sure you have that imported so I have Chevron down and user plus from lucidreact great it is a self-closing
3:27:26
tag and let's give it a class name of h-4 W-4 and ml Auto like this there we
3:27:33
go so now you can see how nice this looks perfect and now let's go ahead and let's just
3:27:41
copy and paste this below like this so now we have two items if I click I
3:27:48
have twice the invite people and let's change this to is admin like this and
3:27:55
let's just modify this to not use any text Indigo so you can remove this text Indigo so just make sure that this class
3:28:02
name this drop down item has the padding on top and on the sides a small text and
3:28:08
a cursor pointer instead of invite people this is going to say server settings like this and instead of user
3:28:16
plus we're going to use the settings icon from Lucid react so make sure you have Chevron down settings and user plus
3:28:25
from Lucid react grade and only in admin can see the server settings and only an
3:28:31
admin can open that model when we create it great so let's go ahead and copy this
3:28:36
again just fix the indentation and this one is also going to be just
3:28:43
for the admin so we can leave this if and change the server settings to manage
3:28:48
members like that and instead of using the settings icon we're going to use the users icon from lucidreact so just make
3:28:55
sure you have that imported great so now we have invite people server settings and manage members here perfect
3:29:03
and now we're gonna go ahead and add a new one so just copy and paste
3:29:08
that but this one is going to be visible for both admins and moderators so we can
3:29:15
just use is moderator because every admin by default is also a moderator uh
3:29:21
and let's go ahead and change manage users to create channel like this great
3:29:27
and let's change the user's icon to Plus circle from Lucid react so just make
3:29:33
sure you have plus circle from Lucid react great and if I click now I have server settings manage members and
3:29:39
create a channel great now let's go ahead after this let's just
3:29:45
add another is moderator and n and this
3:29:50
one is just gonna render a drop down separator sorry drop down menu separator
3:29:55
from add slash components UI drop down menu like this so make sure you have
3:30:01
this imported from UI drop down menu and not from Radix okay so you can see how I
3:30:07
have this small little line here at the bottom so only admins and moderators needed this separation because guests
3:30:14
are only going to have one action and that is to leave the server so no point in showing this separator down
3:30:20
uh great and now you can just copy and paste this one from above so from Above This separator and paste it here okay
3:30:28
and instead of saying is moderator this one is only going to be for the admins so it's admin like this and instead of
3:30:35
create channel it's going to say delete server like this and instead of plus
3:30:41
Circle we're going to use the trash icon from Lucid react so make sure you have imported the trash icon from lucidreact
3:30:48
great and now I have this delete server right here and let's just add a class
3:30:54
name to this drop down menu item which holds the delete server to use text Dash
3:31:00
rows-500 like this great so we can see now when
3:31:05
you click delete server is a red meaning that it's a dangerous action
3:31:10
uh great and now let's go ahead and copy this one last time and we're gonna
3:31:16
create the last one and this one is going to be very simple so we're going to do the opposite of his
3:31:22
admin so we're gonna just add an exclamation point so if we are a moderator or if we are a guest basically
3:31:30
if we are not an admin only then we're gonna have the option to leave the server so admins cannot leave the server
3:31:37
admins can only delete their own service and let instead of the icon trash let's use the log out icon from lucidreact so
3:31:45
make sure you have logout like this and now I actually cannot see that because I
3:31:51
am an admin but guests and moderators will be able to see that great so let me
3:31:57
just expand this entire thing and zoom in so you can see how this looks there we go invite people server settings
3:32:03
manage members create channel and delete server perfect so we're gonna now create
3:32:08
models for all of this right here so now let's go ahead and let's create
Invitations
3:32:15
our invite functionality which is the first drop down action right here to invite people in order to do that we
3:32:22
first have to visit our use model store so let's go inside of the hooks and pick
3:32:28
the use model store right here and alongside create server go ahead and add
3:32:34
a pipe and this one is gonna say uh invite so just invite like this great
3:32:41
now we have to extend our model store a bit so alongside uh model store we're
3:32:47
also going to have an interface model data like this and for now model data is
3:32:54
only going to accept a potential server so it doesn't have to but if we want to
3:32:59
we're going to send in a server and you can pass that from Prisma slash client like this great and now inside of here
3:33:06
after type add data and data is going to be model data like this great so now go
3:33:14
ahead and add a data in here and by default it's going to be an empty object and now extend this is open to also
3:33:22
accept the data prop which by default is going to be empty which means we also have to change it in
3:33:28
this on open right here so go ahead and add data optional data sorry model data
3:33:36
like this great so we added data model data and on on open we added data here
3:33:42
and we defined the potential items we can send in a model uh great so
3:33:47
alongside setting the type we're also going to set the data so let me just expand my screen so on open has a type
3:33:54
and a data and if we pass in the data it's going to be stored in our model
3:33:59
store so for example uh right now we're gonna have to open our invite model with
3:34:05
some information about that server so that's what we're going to send the server inside the data using this on
3:34:12
open function right here great so let's go back inside of our server header
3:34:17
which is inside components server server header right here and at the top right
3:34:23
here above the is admin let's add const
3:34:29
on open Chrome use model like this from add slash hooks use model store so make sure
3:34:36
you have use model imported from s slash hooks use model store great and now
3:34:41
let's find the first drop down item which says invite people and we're going
3:34:46
to add and on click here uh which is going to open that model so let's go ahead and write on click like
3:34:53
this an arrow function on open we're going to open the invite model and we're
3:34:59
gonna go ahead and pass in the data sorry so just an object like this with a
3:35:04
server like this so this is the equivalent we're just going to use a shorthand operator like this and where
3:35:10
do we get this server from well we have it in the props right here uh great so
3:35:16
now that we have that we can go ahead and we can create our invite model great
3:35:21
so let's go ahead and let's close everything here let's go inside of our components models
3:35:27
and you can just copy the create server model and paste it again and rename it to invite Dash model like this great
3:35:35
let's go ahead and let's remove this form schema we're not going to need it that means that we can also remove this
3:35:43
entire form right here so you can remove that you can also remove this is loading
3:35:49
and you can also remove this on submit right here same thing for handle close so you can
3:35:57
remove that as well and you can change this handle close to directly use this
3:36:02
on close from use model so just on close like this great now let's go ahead and
3:36:08
let's remove this entire form so we don't need absolutely anything here we can go ahead and remove this entire form
3:36:15
so just leave the dialog header ending here and you can just write invite model
3:36:20
like this great uh let's also remove the router like this let's rename this to invite model
3:36:30
like that and you can now remove all of these Imports we don't need them same
3:36:35
thing perform like this and you also don't need the dialog footer great and
3:36:41
same thing for all of these components here great so we have a very simple model right here just make sure you're
3:36:48
doing that inside the invite Dash model and now let's change this is model open to not change for to not look for the
3:36:55
create server but for invite like this there we go great now let's go
3:37:01
ahead and let's add this invite model to our model providers so go inside of your
3:37:06
providers model provider like this and go ahead and Below create server model
3:37:11
at invite model like this from dot dot slash models slash invite model and I'm
3:37:17
just gonna go and replace this to slash components like this there we go and I think that already now
3:37:25
we can try and press and invite people and there we go so you can see how we have this
3:37:31
invite model right here so let me just zoom this out so we can work uh with
3:37:36
this model so I'm going to click again okay there we go now let's go ahead and let's go
3:37:42
back inside of our invite model which is inside of our components models invite model right here and let's change the
3:37:49
title so it's not going to be customized server it's going to be uh invite friends like this and we don't need the
3:37:57
dialog description you can remove that and you can also remove this dialog description import like that uh great
3:38:06
so now go below the dialog header here remove this dial invite model text and
3:38:13
create a div this div is going to have a class name of padding six like that
3:38:18
great uh now let's go ahead and let's add a
3:38:23
label here so label from dot dot slash UI slash label so make sure you've
3:38:29
imported this from dot dot slash UI label but we're going to change that to slash components like that and let's
3:38:35
just join these two together great so we have the label here and let's just
3:38:41
write server invite link like this great so you can see how it now says server
3:38:46
invite link here let's go ahead and let's give this a label a class name
3:38:54
which is going to be uppercase tax Dash XS font Dash bold backslash sync Dash
3:39:02
500 dark text Dash secondary slash 70.
3:39:10
like this great and now below this we're going to create a div So Below the label
3:39:16
we're going to create a div and we're going to go ahead and give this div a class name of flex items Dash Center
3:39:23
margin top Dash 2 and GAP Dash x dash 2 like that great
3:39:30
so save this and inside we're going to go ahead and add our input from dot dot
3:39:37
slash UI input so make sure you import the input and I'm just going to replace this with components like this great so
3:39:45
inside of this input let's go ahead and let's write a class name which is going
3:39:50
to be pg-sync 300 50 border Dash 0 Focus
3:39:57
dash visible ring Dash zero tax Dash black and focus
3:40:04
visible ring Dash offset-0 like this great let's give it a
3:40:13
value for now of invite link so we're just gonna hard code invite link like
3:40:19
this great and alongside this input but still inside of this div let's add a
3:40:26
button from dot dot slash UI button so make sure you import this button right here and let's replace this with
3:40:33
components like that great and in here we're going to give it
3:40:38
a size of Icon like that so go ahead and just write a copy from
3:40:45
lucidreact icon so make sure you've imported copy from Lucid react I'm gonna move it to the top just below the use
3:40:53
client like this and let's go ahead and let's give this a class name
3:40:59
of W-4 and H dash 4 like this great
3:41:06
and now outside of this div right here let's go ahead and add another button
3:41:12
which is going to say generate a new link like this so just below this we're
3:41:18
gonna have this generate a new link so now let's go ahead and style it a bit so first thing I'm going to do is variant
3:41:24
is going to be linked like this size is going to be small like that and class
3:41:31
name is going to be tax Dash extra small and tax Dash sync Dash
3:41:36
500 and margin top is going to be four there we go so we have a nice generate a
3:41:41
new link text right here perfect now inside of this button we're
3:41:47
going to add refresh C V like this lowercase w there we go so
3:41:54
refresh CV and let's make sure you import that from Lucid reactor okay now
3:41:59
let's just style it a bit so let's go ahead and let's give it a class name
3:42:04
of w-4h-4 and margin right-2 like this
3:42:12
uh okay and let's just modify this so instead of margin right let's use margin left there
3:42:19
we go so now it's better perfect so now let's go ahead and let's create
3:42:24
one hook which we're going to need to read the current URL so let's go inside
3:42:30
of our Hooks and create a new file use Dash origin dot TS like this great and
3:42:37
inside of here we're gonna write export const use origin like that it's going to
3:42:42
be a very simple hook so const mounted set mounted use state from react default
3:42:50
value is false like this use effect also import that from react anti-dependency
3:42:56
array and set mounted is going to be true like this great now let's write
3:43:02
const origin to be type of window is not undefined like that
3:43:08
and window.location.origin question mark window.location.origin
3:43:17
or an empty string like this so let me just zoom out so you can see this in one
3:43:22
line and let me also expand my window so like this origin is a type of window
3:43:29
so if type of window is not undefined and if we have the window location dot
3:43:34
origin in that case render thewindow.location.original otherwise render an empty string great
3:43:41
so now let's go ahead and let's write if is mounted sorry if mounted like that
3:43:48
return now so if we are not mounted make sure you put an exclamation point here and you actually don't have the return
3:43:54
now you can also just return an empty string otherwise return origin like that great so just make sure you have this
3:44:02
hook you can close this now and go back inside of your invite model and let's go ahead and let's add that
3:44:09
hook now so just below this use model const origin use origin
3:44:15
from add slash hooks use origin like this great now let's go ahead and let's create a
3:44:21
constant here so cons invite URL is going to be back things at origin
3:44:30
like this and copy this invite URL and replace the value of this input where we
3:44:36
hard coded the invite link so just change it to a dynamic invite URL so now it says localhost 3000 in this invite
3:44:43
friends great so now let's go ahead and let's extract the model data which we
3:44:49
passed so in order to do that what we have to do is just extract server from
3:44:55
data and we need to make sure to extract the data from use model like this and
3:45:01
then we can use this server to extend this invite URL so add slash invite
3:45:06
slash server whoops open special object server question mark dot invite code
3:45:12
like this there we go so now let me just show you you can see
3:45:18
that in my model I have a slash invite and the invite code from my database
3:45:24
great so let's go ahead and let's continue developing this model so what I'm going
3:45:30
to do is I'm going to add some constants cons copied set copied to be used state
3:45:38
from react default value is false so make sure you import your state from react I'm just going to move it here to
3:45:44
the top like that and let's also add const is loading set is loading use
3:45:51
State false like this great now let's create a
3:45:57
function to actually copy this so const on copy is going to be an arrow function which is going to call the
3:46:03
navigator.clipboard
3:46:09
dot write text invite URL like this so we're gonna copy this constant invert
3:46:15
URL using the origin slash invite and invite code great and we're gonna set
3:46:21
copied to true and then we're going to add a timeout like this
3:46:27
set copy to false after a thousand milliseconds equaling
3:46:34
to one second great so you're gonna see what that does now so let's go and find the copy button so
3:46:41
it's this one inside of this div which has our input and has a copy listed icon
3:46:47
inside and let's give it an on click on copy like this okay and now let's just
3:46:54
change this so if it's copied in that case we're going to render check icon
3:47:00
from Lucid react so make sure you import the check from Lucid react
3:47:06
otherwise we're going to render this copy icon so you can remove it from here and paste it inside and you can copy
3:47:13
this class name here and paste it here there we go so we can also display this like this so it's a
3:47:20
bit clearer there we go and now you can see how this effect is
3:47:26
going to look so I'm going to zoom in back into my model so when I click copy you can see that I get a check mark and
3:47:32
then it's back to copy it again perfect uh great so what I have to do now is a
3:47:39
function to regenerate this link so let's go ahead and let's write that function
3:47:44
So Below the on copy let's write a const on new to be an asynchronous function
3:47:52
like this open a try and catch Block in the catch error we're just going to
3:47:57
console log the error and in the finally you're going to set
3:48:03
is loading to false which means that in the try block we're going to set this
3:48:08
uploading to True like this great and now let's just write const response
3:48:15
will be a weight axis which you can import from axios so make sure you
3:48:20
import axios I'm just going to move it all the way to the top here great
3:48:25
so await access dot patch open pointy brackets sorry open backticks
3:48:31
slash API slash servers slash server.id
3:48:38
slash invite Dash code like that and just put a question mark in the
3:48:44
server.id like this so let me just expand this so you can see it in one line
3:48:49
and there we go so constant response is equal to await axis dot patch slash API slash servers the server ID invite code
3:48:58
so we're going to use this axios patch to refresh the invite code and what
3:49:04
we're gonna do now is we are going to call our own open again so make sure you extract that from use model so let me
3:49:11
zoom in back so we're going to call on open again from this use model hook and
3:49:16
we are literally going to open the very same model so invite model and we're
3:49:24
just going to update its data by passing server to be response.data so we're
3:49:29
going to get the updated invite code and then this server invite code this
3:49:34
constant is going to get immediately uh it's gonna immediately uh refreshed
3:49:40
great now let's use this as loading for some uh disabled States great so let's
3:49:46
go ahead and let's find our input right here let's give it a disabled
3:49:53
off is loading like that let's give the copy button a disabled if
3:50:01
we are loading and let's give the regenerate a disabled
3:50:06
if we are loading like that great so now if you try and click on this
3:50:13
actually we have not assigned what actually calls this on new function so let's go ahead and let's find our
3:50:20
generate a new link button and give it an on clicked to call on new like this
3:50:26
great so now if I try and click generate a new link I'm gonna get a 404 axios error there we
3:50:34
go so I get a four or four in my console because we have not created that route yet so now let's go ahead and let's do
3:50:42
that so let's head into our app folder
3:50:47
so right here we can close everything app folder API servers and you're gonna
3:50:53
have to create a new folder server ID inside of brackets like this
3:51:00
and inside create a route.ds like this great and now let's go ahead and write
3:51:07
export as synchronous function patch which has a request of type of request
3:51:13
and it has params and let's give them a type params is an
3:51:19
object which holds the server ID which is a type of string and we know that because this folder has a server ID name
3:51:27
great so now that we have that let's open a try and catch block so in the
3:51:32
catch let's log the error so console log server ID and just paste in the error
3:51:40
like this and let's return new next response from next slash server like this internal
3:51:49
error and just pass in the status of 500 like this great in the try block let's go
3:51:57
ahead and fetch the profile so const profile is a weight current profile
3:52:02
from add slash lib current profile like this if there is no profile in that case
3:52:12
return new next response unauthorized with a status of 401 like this
3:52:20
status there we go and now what we have to do is check if we don't have the
3:52:26
parents server ID so if there are no params.server ID return new next response
3:52:34
server ID missing with a status of 400. great
3:52:41
and now let's actually update our server so const server is equal to await DB
3:52:47
which you can import from add slash libdb so make sure you do this great and
3:52:52
now let's write a rate db.server dot update like this where
3:52:59
ID is equal to rams.server ID and profile ID is equal to profile dot
3:53:06
ID like this great and data is equal to invite code
3:53:12
and what we have to do is generate a new invite code in order to do that we have
3:53:17
to import our uuid library so import B4 as uuid V4 from uuid like this great
3:53:26
so just go back to the invite code and call the uuid V4 and execute the
3:53:32
function so only an admin will be able to do this call because we are checking
3:53:37
for the profile ID that created this server so no need to check uh inside of
3:53:43
the members and then find some uh and then find the role or or profile ID so
3:53:50
no need to do and anything like that we can just check the profile ID because the only profile ID that's possible to
3:53:57
be in this server is the creator of the server great
3:54:02
and now that we updated This Server let's just return new next whoops so
3:54:07
next response dot Json and passing the server like this
3:54:13
great uh perfect so now let's try what happens so I'm gonna refresh this I'm gonna
3:54:20
click invite people and I'm going to click generate a new link and let's see if we are still getting some errors so
3:54:27
I'm generating a new leak okay it still says that it's 404 so let me just go
3:54:32
ahead and debug this all right so the mistake is very simple
3:54:38
so you can see that I'm pointing at slash invite code but I never created that route the route that I created is
3:54:46
server ID route.ds so what I have to do is create a new folder invite Dash code
3:54:52
inside of this server ID folder and drag and drop this route inside so just move
3:54:57
it like this there we go save the file again let's refresh this now
3:55:04
and if I am correct after I click on invite people and generate a new link
3:55:11
there we go you can see how the invite URL changes every time we click generate
3:55:16
a new link perfect so what we have to do now is the actual functionality that
3:55:23
when someone enters this inside of their URL they actually Join This Server because if you try and paste this now
3:55:30
here you're gonna get a 404 because we never created this page so now let's go ahead and let's do that
3:55:38
so let's go back inside of our app folder so I'm going to close everything
3:55:43
here just make sure you saved all of these files and make sure that your generation is working
3:55:48
okay and now let's go back inside of the app folder and let's create a new organizational folder called invite like
3:55:56
this and this invite is not going to have any layout it's just gonna have routes like
3:56:04
this and inside let's create a new folder called invite like that and inside of
3:56:11
that create another folder in Brackets invite code like this and that's going
3:56:17
to be our page.dsx great so invite organizational
3:56:22
folder routes organizational folder invite folder and invite code folder
3:56:28
which is dynamic perfect so let's go ahead and let's write invite code page
3:56:35
like this you can just return it div hello invite for now it doesn't matter it's not going
3:56:42
to have any content it's just gonna do and it's just gonna add you to the server and then redirect you to the
3:56:48
server so let's go ahead and let's create an interface invite code page props
3:56:53
Rams invite code is a string
3:56:58
like this so make sure that this invite code inside of the params matches the folder name so invite code invite code
3:57:06
it needs to be the same great now let's go ahead and let's extract ramps here
3:57:11
and let's just map that to invite code page props perfect let's
3:57:17
make this page a synchronous so we can do some calls to the database now so first one we're gonna do is fetching
3:57:23
the current profile so const profile is equal await current profile from add slash lib current profile like I've
3:57:30
imported here at the top great if there is no profile in that case return
3:57:36
redirect to sign in from clerk next JS so I'm just going to separate those two
3:57:42
great now if there are no params.invite code return redirect from next slash
3:57:50
navigation so make sure you import redirect from next slash navigation I will move that to the top as well and
3:57:55
we're just going to redirect to the root page so if the user doesn't enter the
3:58:01
invite code we can just return them back now let's check if the person trying to
3:58:06
Join This Server is by chance already in This Server so for that we're going to write cons existing server to be await
3:58:15
DB and import DB from add slash lib slash DB like I did right here great
3:58:23
so awaitdb.server dot find first like this
3:58:28
where invite code is equal to params.invite code so if it matches in and if members
3:58:36
sum raw file ID is equal to profile.id so if
3:58:43
we match the invite code of the server we are trying to join and if we are already a member of that server in that
3:58:50
case all we have to do is redirect the user back to that server no need to join
3:58:55
again so if existing the server return redirect open backticks slash
3:59:03
servers slash existing server dot ID inside of this special object perfect
3:59:11
and now let's create a case to join the server so const server is equal await
3:59:17
db.server dot update like this where invite code is equal to params.invite
3:59:25
code like that data and we have to create a new member
3:59:30
so members create open an array open an object
3:59:35
profile ID is equal to profile dot ID and we don't need to explicitly give it
3:59:41
a roll of guest because by default everyone who joins is going to be
3:59:46
uh is going to be a guest great so let
3:59:52
me just uh check what this error is about all right so I found our mistake our
3:59:59
mistake is in our schema so let's go ahead you can save this for now and just ignore this error and go inside of your
4:00:08
Prisma schema.prisma right here and you can see that here for the invite code I put a
4:00:14
string and a db.txt no need for that you can remove db.txt and instead add unique
4:00:20
so now we are able to query and find unique servers using this invite code so
4:00:26
my mistake and now remember every time we modify our schema Prisma we have to
4:00:32
run two commands so shut down your application and run MPX Prisma generate
4:00:38
so this is gonna update this to our node modules and you can already see how the error in my page went away and now npx
4:00:46
Prisma DB push like this
4:00:52
and what happened now is that we added a specific change that is causing income
4:00:59
incompatibility with our current data in the database so we're gonna have to remove all of our servers so far and you
4:01:07
can just press y to confirm this there we go and now let's npm run Dev
4:01:14
this again and let's see if we lost our servers so this is normal to happen during development when you modify the
4:01:21
schema Prisma uh you're often going to create new relations new rules uh which
4:01:26
cause stuff to fail so it looks like ours uh is still working here
4:01:31
so what I actually prefer that you do is reset your database
4:01:37
so just so we are working with correct data so let's shut down the application and run npx Prisma migrate
4:01:46
reset like this so this is going to remove our entire database so confirm
4:01:51
this pressing y on your keyboard and after you do this you have to run npx
4:01:58
Prisma generate again and npx Prisma DB push again
4:02:05
and then you can go ahead and npm run Dev your application again so npm run
4:02:13
Dev again and now if I refresh on this localhost I
4:02:19
should get redirected back to the root page with the initial model telling me
4:02:24
to create my server perfect because no data exists so I'm going to create my
4:02:29
new server again I'm going to call it code with Antonio like this I'm going to
4:02:35
click create and after this refreshes I should be
4:02:40
back to the server ID page perfect and now I have my sidebar I have my invite code and if I generate there we go it
4:02:47
works perfect so now let's head back inside of our invite page so
4:02:54
let's go back inside of the app folder invite routes invite invite code
4:03:01
page.psx right here perfect so once we find this server using the unique invite
4:03:07
code which we just served and we create a new member who is trying to join all
4:03:13
we have to do then is redirect them to that new server so if there is a server
4:03:21
return redirect backticks slash servers slash server dot
4:03:29
ID like this great and instead of this you can just return now like this so I
4:03:35
just said we're not actually going to render anything here instead we are first going to fetch the current profile
4:03:41
we're going to check whether we have an invite code or not we're going to check if the user is already a part of this
4:03:48
server if it is we are going to redirect them to that server otherwise we are going to
4:03:53
update the server using the unique invite code which we just modified in our schema Prisma so now it's Unique for
4:04:00
every server and we modify the data we verify the members and we create a new member using
4:04:07
this profile ID and because our members let me just scroll to members our
4:04:13
default value for the role is guest we don't have to explicitly write that here
4:04:18
so just profile ID is enough and no errors in our code perfect so what we
4:04:25
have to do now is we have to try this out so what you have to do is well let's
4:04:30
test this with logged in users so I just copy this either like this or use the copy function
4:04:37
right now I'm already in This Server so let's see what happens once I paste here
4:04:42
what should happen is I should get redirected back to my server and that's exactly what happened perfect and now
4:04:49
what you have to do is log out and log in to another account and try and paste
4:04:56
that in your url so that's what I'm gonna do I'm just gonna log out and enter a new account there we go so I just logged in in a new
4:05:03
account and you can see that it's asking me to customize my server because I have not joined or created any servers in
4:05:09
this new account so I'm gonna go in inside of my URL and I'm going to paste that which I copied from a previous
4:05:15
invite model I'm going to paste and let's see if this is going to add me and
4:05:21
there we go I am now part of code with Antonia you can see right here that I have a completely different icon so this
4:05:27
is my different account and since I'm a guest look at this I only have the option to leave the server that is my
4:05:33
only option here perfect so you successfully finished uh the inviting
4:05:39
great so what I suggest you do is that you log in back into the account that is
4:05:45
an admin on This Server so you can continue developing all the other options so I'm just gonna do that
4:05:50
quickly there we go so we completely wrapped up our invite people we can generate new
4:05:56
links so now that I click to generate a new link if the person tries to send that old URL to someone else it's no
4:06:03
longer going to work because it changed in the database so that's how cool this generate a new link is because we can
4:06:09
easily invalidate links if we don't want them to be spread around perfect so you
4:06:15
finish the invite friends model uh you confirm the functionality works and next
4:06:20
thing we're going to do is the server settings so now let's go ahead and let's create
Server Settings
4:06:25
this server settings model right here so in order to start doing that we have
4:06:31
to go back inside of our use model store so go inside of the hooks and find the
4:06:37
use model store we have to find our model types and we have to extend it by
4:06:43
adding edit server like this great so now that we have that everything else
4:06:49
can stay the same so we already have the model data to pass the server information and we have that configured
4:06:56
in our on open function so we needed this for the invite model and we're also
4:07:01
going to need it for the edit model great let's go now inside of our components models find the create server
4:07:09
model and copy and paste it here and rename this copy to edit Dash server
4:07:15
Dash model like this go ahead and rename this constant but just make sure you're
4:07:22
actually inside of the edit server model and not accidentally in the create server model and rename this to edit
4:07:28
server model like this and modify this is model open to check for edit server
4:07:35
like this we're going to leave everything as it is for now great I'm going to close everything here I'm gonna
4:07:41
go inside of my components providers model provider and below the invite
4:07:47
model I'm going to add edit server model like this from DOTA slash models edit
4:07:53
server model and I'm just going to modify the slash components like this great
4:07:59
so now that we have this let's go ahead and let's find our components uh server
4:08:06
server header right here and we already have this on openly structured from the used model so let's use it the same way
4:08:13
we did for invite people let's add an on click for this drop down menu item which
4:08:19
holds the server settings so let's write on click an arrow function
4:08:25
on open edit server and let's pass in the server
4:08:31
as the data like this great so now if you go ahead and try and click on server
4:08:38
settings you should see the model to create the server perfect so I'm gonna keep this open and I'm gonna go back
4:08:45
inside of my components models edit a server model right here perfect so let's
4:08:54
go ahead and let's actually modify some things so in the use model we're also
4:08:59
going to get data like this so below this constant is model open let's
4:09:04
extract the server from it so server is equal data like this perfect and now let's add
4:09:12
a use effect which is going to fill these values with existing data so use effect from react
4:09:19
like I did right here make sure you add this import I'm just going to move it here like this in this use effect you're
4:09:27
going to create an arrow function yep that's correct my apologies so like
4:09:33
this add the dependency array and inside we're gonna check if there is a server
4:09:39
from this data which we desstructured so if we pass the data when we clicked on open from the server header we're gonna
4:09:46
call form dot set value to be name server dot name like this and form dot
4:09:55
set value image URL is going to be
4:10:00
server.image URL like this great and now let's just pass in the necessary items
4:10:08
in the dependency array which are going to be the server and the form like this and there we go once I saved you can see
4:10:15
that now my model is showing the information from this server so if I
4:10:20
click on server settings there we go I have my icon and I have my server name perfect now let's go ahead and let's
4:10:28
modify this create button so it doesn't need to say create it needs to say save
4:10:33
so I'm going to find the create label and change it to save like this there we go now it says save perfect and what we
4:10:42
have to modify now is our on submit function so it doesn't need to call the axis post
4:10:48
to Aba servers instead it needs to call axis.patch and the URL is going to be a
4:10:56
bit different so we can remove this instead add backticks and write slash
4:11:02
API slash servers slash open curly brackets server question mark dot ID
4:11:09
like this so we changed from post to patch and we modify the URL to Target a
4:11:15
specific server ID to edit perfect and now that we have that let's go ahead and
4:11:21
let's create a route which is going to do this because if you try right now I'm gonna prepare my console right here
4:11:29
so if I click save it says 404 not found so let's fix that by actually creating
4:11:36
that route let's go and let's find our app folder our API our servers server ID inside we
4:11:45
already have the invite code but I want you to create a route.ts file inside of
4:11:51
this server ID file so new file route.ts so you can see how now I have a route
4:11:57
inside the server ID folder and I have a separate invite code folder here so this
4:12:03
is actually the thing that we did before I figured out that I have to create a new folder if you remember so just make
4:12:09
sure you have a route.ds inside of the server ID where your invite code folder
4:12:14
is but not inside the invite code folder great and inside of here let's go ahead
4:12:20
and let's find sorry let's develop the patch function so export as synchronous
4:12:27
function batch like this which takes the request
4:12:32
which is a type of request and it takes params and let's map that object params
4:12:39
to be a server ID which takes in a string like that again make sure that
4:12:46
this server ID here matches the folder server ID perfect now let's go ahead and
4:12:52
let's open a try and catch block so let's get the error from here let's
4:12:58
log it for development purposes so server ID patch
4:13:04
error like this and return new next response from next slash server internal
4:13:13
error with a status of 500 like this perfect and now let's
4:13:21
develop the actual patch function so first let's get the current profile const profile is equal await current
4:13:28
profile from add slash lib slash current profile and I'm immediately going to separate those Imports let's go ahead
4:13:36
and let's check if there is no profile so if there is no profile return new
4:13:41
next response unauthorized with a status of 401 like this great and
4:13:50
now let's write const server will be await db.server dot update
4:13:58
and let's not forget to import DB so import DB from add slash lib slash DB
4:14:06
right here so let's find the server using the server ID so ID is equal to
4:14:12
params.server ID like that and let's modify the data
4:14:19
and the data we have to modify is name and image URL so in order to do that we
4:14:24
first have to destructure it let's do that below this profile so const the
4:14:29
structure the name and image URL from await request.json like this and
4:14:36
pass in the data name and image URL like this great and one more thing in the
4:14:43
where Clause let's also add profile ID to be the current profile which we loaded dot ID so only in admin can
4:14:51
modify the server settings great and now let's just go ahead and return new next
4:14:58
whoops next response.json server like this
4:15:03
there we go so let's go ahead and let's attempt to modify This Server now so I'm going to write uh let me just refresh
4:15:10
everything so now it says code with Antonio here also when I hover here but
4:15:15
if I go to server settings and change this to edited server let's see if that's going to work so I clicked save
4:15:23
and there we go now it says edited server and here it also says edited server great great job you successfully
4:15:30
finished the update function of the server so the next one is to create and
4:15:36
manage some members so let's go ahead and let's create the
Manage Members
4:15:42
model which is going to open when we click on manage members right here so let's go ahead and let's visit our use
4:15:50
model store so go inside of the hooks and find use model store right here and
4:15:56
we have to add another type of model this one is going to be called members like this we don't have to modify
4:16:02
anything else in the model data we're still going to be working with just the server as the data great and now let's
4:16:10
go ahead and let's go inside of our components folder models and go ahead
4:16:15
and copy the invite model because I feel like this one is going to be the easiest to modify in order to match what we need
4:16:21
for the manage members model so just copy this invite model paste it inside of models and rename it to members model
4:16:29
like this perfect go inside of the newly created members model and let's rename
4:16:35
it to members model and the only thing we're we're going to modify is this is
4:16:40
model open instead of looking for invite it's going to look for members like this the same that we defined in our use
4:16:48
model hook right here so make sure it matches this members type right here
4:16:54
great and now let's close everything make sure you saved all of those files go inside of components providers model
4:17:02
provider right here and below the edit server model add the members model like this
4:17:10
and what I'm going to do is just rename this to add slash components so you
4:17:15
don't have to do this but I like it that way now let's go ahead and let's find our server header function in This
4:17:22
Server folder so not server sidebar but server header
4:17:28
and inside find the drop down menu item which says manage members and using the
4:17:34
same method we're going to call the on open which will be structured from the use model hook so on click is going to
4:17:41
be an error function which calls the on open members and passes in the server as the
4:17:49
data perfect so let me just expand this I'm going to refresh this page and let's
4:17:55
go and click to manage members and there we go it opens the invite friends because we copied it from that model
4:18:02
perfect so I'm gonna keep this open and let's go ahead and let's actually start developing here so I'm closing
4:18:09
everything inside and I'm going inside of components model members model right
4:18:14
here perfect so first things first we are not going to need this origin so we can remove that
4:18:21
and we can remove the hook for importing the use origin we are also not going to need the invite URL right here so you
4:18:29
can remove the entire on copy function as well you can remove the entire on a new function as well we are not going to
4:18:37
need uh these two states so you can remove copied and set copied like this
4:18:42
and you can also remove everything inside of this div so this div which has
4:18:51
a class name of padding 6 which is just below the dialog header you can go ahead and select everything inside of that div
4:18:58
and remove it like this and just write hello members so it should look something like this a
4:19:05
very very simple model perfect now let's go ahead and let's change the title from
4:19:10
invite friends to manage members like this great and now let's go below and
4:19:18
add dialogue description from add slash components slash UI dialog so don't
4:19:24
accidentally import it from Radix let me show you my import right here so dialog description from add slash components UI
4:19:31
dialog and you can go ahead and remove this Imports for now if we need them
4:19:37
again we are going to add them there we go so these are the only Imports I have I have the dialog and I
4:19:44
have the use model from the use model store all right inside of this dialog description what we are going to do is
4:19:52
we are going to count our members so I'm going to write server question mark
4:19:57
members question mark length and after that I'm gonna say members so it's gonna
4:20:03
say five members or zero members and let's take a look at what happened so we
4:20:09
have the correct number right here it says two members we're going to style it and position it but our typescript is
4:20:16
throwing an error that is because inside of our use model
4:20:21
so let me just go inside of the use model we Define the model data to be server
4:20:27
but we are looking for members here so what I'm going to do is a very quick
4:20:33
typescript fix for this specific use case go ahead and find inside of the
4:20:38
members model this the structuring of server from the data and what you're going to do is write data as open an
4:20:46
object and inside all you're going to do is server and give it a type of server
4:20:53
with members with profiles from ad slash types there we go so just import this
4:21:00
server with members with profile so let me show you how this looks in one line so const server is data as an object
4:21:08
which holds the server which is a type of server which has members and their profiles and now this typescript error
4:21:15
is no longer here and we can safely iterate over the members perfect
4:21:20
great and now let's go ahead and let's give this description some styling so go
4:21:25
to dialog description and give it a last name like this
4:21:32
and let's go ahead and let's write text Center like this and text sync Dash 500
4:21:39
like that there we go that looks much better in my opinion perfect let's go
4:21:44
outside uh yes one more thing that I want to do is I want to put the dialog
4:21:50
description inside of the dialog header so I close this dialog header too early
4:21:55
so what I'm going to do is I'm going to copy this dialog description and I'm just gonna paste it below the
4:22:03
dialogue title like this there we go and just save now there was a slight
4:22:09
difference so now it's a bit closer to the title and it's following the correct semantic approach to doing this so the
4:22:15
dialog header component is now wrapping both our dialog title and our dialog
4:22:21
description so all I did was moved it from outside of the dialog header inside of the dialog color
4:22:27
perfect now let's go ahead and let's remove this div right here and instead what I'm going to do I'm
4:22:34
going to add scroll area from dot dot slash UI slash scroll area like this so
4:22:41
I'm gonna rename this to add slash components like that make sure it's not accidentally imported from Radix
4:22:48
great inside of the scroll area I'm gonna go ahead and give it a class name
4:22:53
of mt-8 Max height of 420 pixels and PR
4:23:02
dash six like this great inside we are going to iterate over this
4:23:09
members and map them as well as their actions so let's go ahead and write
4:23:15
server question mark members question mark map like that let's get the
4:23:20
individual member and let's go ahead and let's create a div
4:23:25
with a key of member dot ID like that and let's give this div a class name of
4:23:33
flags items Dash Center Gap Dash X-2 and margin bottom of 6 like this
4:23:40
great inside of this div we're going to create a new component called user
4:23:47
Avatar so in order to do that let's first render it user Avatar like this
4:23:53
and now we're going to get an error so let's go inside of our components folder
4:23:58
and create a new file user Dash avatar.tsx like this in order to
4:24:05
continue developing here we need to add a component from chat c and UI so let me expand this screen and let's go ahead
4:24:12
and let's find the Avatar component right here and let's use this command from the CLI
4:24:19
to add it to our project so I'm going to shut down my application I'm going to
4:24:24
write this Command right here npx chat cn-ui at latest add Avatar and just
4:24:30
press enter and confirm the installation once that is done you can go ahead and
4:24:37
npm run Dev your project again great so I'm just gonna go ahead and refresh my
4:24:44
application because I shut it down so make sure it's all loaded let's just
4:24:49
wait a second and let's click back on the manage members and there we go I have the very same error again so let's
4:24:57
go ahead and let's import Avatar and Avatar image
4:25:04
prompt at slash components slash UI slash Avatar like this so I'm doing this
4:25:10
inside of my newly created user Avatar component and inside I'm also going to create an
4:25:16
interface user Avatar props to have an optional source which
4:25:21
is a string and a class name if we want to modify it as a string as well and
4:25:27
also optional and Export cons user Avatar
4:25:32
like this and let's just destructure these items inside so source and class
4:25:37
name and let's map them to our props so user Avatar props like that and let's
4:25:44
return an avatar whoops Avatar like this we already have that imported and Avatar
4:25:51
image like this let's give it a source of source like that and now let's give
4:25:56
this a dynamic class name so it's not going to use strings instead it's going to use the good old CN from
4:26:03
add slash lib yields like this let's go ahead and let's open this let's add some
4:26:10
default classes here so that's going to be height 7 width 7 on medium devices
4:26:17
height is going to be 10 on medium width is going to be 10 as well and let's also
4:26:23
pass in the class name as our optional secondary prop in case we ever want to
4:26:29
modify this perfect now we can go back inside of our members model and we can
4:26:34
actually import the user avatar from dot dot slash user Avatar and I'm going to
4:26:40
rename this to slash components like this there we go so let me refresh this
4:26:45
project again and let me find the manage members and there we go no more errors
4:26:51
perfect so find your scroll area below the dialog header inside of this members
4:26:57
model right here and for this user Avatar you're going to go ahead and pass in the source which is
4:27:04
going to be member dot profile dot image URL like this
4:27:10
and there we go you can see that I have two members inside of my project here so
4:27:16
inside of my server here because if you remember we tested the invite functionality so that's why I'm logged
4:27:22
in here with two of my accounts great so let's continue with this now
4:27:28
so first thing I want to do is just add a bit of padding to this scroll area but
4:27:34
I'm not going to do that directly on the scroll area instead I'm going to find my dialog content right here and I'm just
4:27:41
gonna go and remove this padding 0 from here and there we go you can see how now
4:27:46
my model looks much better perfect so just below this user Avatar now we
4:27:54
can go ahead and render the user's name and their role in This Server So Below
4:28:01
this user Avatar right here let's go ahead and let's add a div
4:28:08
which is going to have a class name which is going to be Flex Flex Dash coal
4:28:14
and GAP Dash y-1 like this and inside go ahead and open a div with a class name
4:28:21
again backslash extra small font semi bold like this flex and items
4:28:29
Dash Center like that and inside let's just go ahead and render
4:28:36
member.profile.name like this there we go one thing I want to do now is a roll
4:28:42
icon map so an object which is going to render our icon depending on the role so
4:28:49
whether a user is a guest moderator or an admin we're gonna display different icons alongside their name so let's
4:28:56
prepare that by going to the top and let's go ahead and let's add a const
4:29:02
roll icon map like this let's open an object let's write guest
4:29:09
now moderator Shield check from Lucid react make sure
4:29:17
you do that import as I did right here and let's give it a class name of h-4 W-4 margin left-2 and text Dash
4:29:29
indigo-500 like that and last one is going to be admin this one is going to
4:29:35
use a shield alert from Lucid react let's give it a
4:29:40
class name of h-4 W-4 and text Dash
4:29:45
rows-500 like this great so now that we have that prepared let's go ahead and
4:29:52
let's go just below Our member profile dot name and let's go ahead and render
4:29:58
role icon map so that constant object we just created and let's pass in the
4:30:04
member dot roll inside like this and there we go you can now see that I have
4:30:09
a little Shield icon next to me right here perfect but let's just add a bit of
4:30:15
a padding next to it so let's see how we can do that we can
4:30:20
go and just add a gap Dash X-1 like this and there we go now it looks much better
4:30:27
so I added a gap Dash X-1 to this div and now they look a bit better perfect
4:30:33
and now what I want you to do is go outside of this div but still inside of
4:30:38
this one so just below this one holding a name in the roll map and add a paragraph in which we're going to render
4:30:45
the member dot profile dot email like this perfect
4:30:50
and let's go ahead and let's add a class name right here which is going to be text
4:30:57
Dash extra small text sync Dash 500 like this there we go perfect so what I want
4:31:06
to do next is I want to add options on the side right here which are going to be triggered which are going to trigger
4:31:13
either changing the role of a user or kicking them from the server
4:31:19
so before we do that let's go ahead and let's add a loading state for a specific
4:31:24
member ID so below this use model go ahead and write const loading ID set
4:31:31
loading ID equals to use State ROM react and its default value is just going to
4:31:38
be an empty string like this and make sure you've imported use state from react great so now that we have this
4:31:46
loading ID let's go ahead and let's find uh This Server members
4:31:53
right here and just below this ending of this paragraph and Below ending of this
4:32:00
div go ahead and write server dot profile ID is not equal to member dot
4:32:08
profile ID and loading ID is not equal to member dot ID and and we're going to
4:32:17
render a div which says actions like this so there we go we are not going to
4:32:23
show any options for the admin of the server because we cannot kick the admin
4:32:28
of the server and we cannot degrade him by changing them to moderator right so
4:32:35
we can only do that with guests and other moderators perfect because only an
4:32:40
admin has access to this model right here and the API functions perfect so
4:32:46
let's go ahead and let's add a class name to this div which for now just says action and it's going to be ml-auto like
4:32:54
this there we go so it's at the end I'm just going to zoom in a bit out so you can see better how that is supposed to
4:32:59
look okay now let's go ahead and let's import everything we need from our drop down
4:33:06
menu so I'm gonna go ahead and add this to to the top so we have a clear
4:33:12
separation of our inputs and now let's go ahead and let's import the following from add slash components
4:33:20
slash UI slash drop down Dash menu like this let's import the drop down menu
4:33:30
drop down menu content like this and let me just see uh what is the
4:33:36
mistake in this one so I just made a type of my apologies so it's drop down menu drop down menu
4:33:44
content drop down menu item like that drop down menu portal
4:33:53
drop down menu separator
4:33:58
separator like this drop down menu sub
4:34:04
drop down whoops drop down menu sub content like this drop down menu
4:34:13
trigger and drop down menu sub trigger like this so all of
4:34:20
this menu content item portal separator Sub sub content trigger and subtrigger
4:34:26
are the components we are going to need to render the actions for each member
4:34:32
perfect so let's go ahead let's remove this label which says action and let's say drop down menu like
4:34:41
that which we have imported now let's add the drop down menu trigger
4:34:46
and let's go ahead and give it an icon of more vertical from Lucid Dash react
4:34:53
so make sure you import more vertical from Lucid react so you should have the shield alert you should have the shield
4:34:59
check and more vertical perfect and let's go ahead and give this more
4:35:05
vertical a class name the class name is going to be h-4 W-4
4:35:12
and text sync Dash 500 like this so a nice little uh
4:35:19
vertical dots perfect now let's add the drop down menu content
4:35:25
and let's give it a prop of side left like this
4:35:31
now inside let's go ahead and let's create a drop down menu sub like this
4:35:40
and let's add a drop down menu sub trigger inside
4:35:45
like that and the drop down menus trigger inside is going to have a class
4:35:51
name of flex and items Dash Center like this
4:35:58
and inside add an icon Shield question from lucidreact
4:36:05
so make sure you import the shield question and put it inside of the menu sub trigger like this let's go ahead and
4:36:13
give this a class name so class name is going to be W-4 h-4 and mr-2 like that
4:36:23
and go ahead and give it a span of roll like this so when I click here now we
4:36:30
have a roll and once we hover on that we're gonna have which options to change
4:36:35
the user from perfect so let's go ahead and after this drop
4:36:41
down menu sub trigger uh what I'm going to do is I'm going to add a drop down
4:36:48
menu portal like this
4:36:53
and inside drop down whoops drop down menu sub content like this great and now
4:37:02
inside we're gonna write drop down menu item like this and this one is going to say
4:37:09
guest like this so let's see if that works there we go so now when I hover it gives me an
4:37:17
option to turn this user into a guest perfect so let's just make this a bit
4:37:22
prettier so above this guest text let's add a shield icon so import shield from
4:37:30
Lucid react so I have shield shield alert check and question
4:37:35
great let's do close this self-closing tag let's give you the class name of
4:37:44
h-4w-4 and mr-2 so let's see how that looks there we go
4:37:50
and one more thing I'm going to do is below this gas text I'm going to do a
4:37:55
conditional so if remember that role is equal to guest in that case go ahead and
4:38:02
render a check icon from lucidreact one more time so import the check great
4:38:10
let me just find where we are okay and inside of here I'm gonna give it a class
4:38:16
name of h-4 W-4 and ml-auto like this so
4:38:23
after I hover I should have a check icon next to guest because this user is only a guest in my server perfect so I'm just
4:38:31
going to zoom out just a little bit so you can see this structure better perfect so it's very long because we
4:38:37
have the drop down menu and inside we have a sub menu and a sub trigger and then we need to do a portal so yes you
4:38:45
can always visit my GitHub if you have a feeling like what you're doing is wrong don't worry about it but just follow
4:38:50
slowly and you should have no problems perfect so what I'm going to do now is I'm going to add another drop down menu
4:38:57
item the same as I did for this guest right here so let's just go ahead
4:39:03
and let's copy that and paste it here and instead of guest this one
4:39:09
so I just added a new one below the menu item here instead of guest this one is going to be
4:39:15
moderator which means that member roll we're going to check for is moderator like this
4:39:21
let's see how that looks like so roll there we go and let's just modify from using the basic Shield to Shield check
4:39:29
and we already have that imported there we go so now you can see that the guest is selected but moderator is not
4:39:36
selected perfect and great so that those are the only roles we can change for so no need to do
4:39:43
anything else here perfect so now go ahead and find where drop down menu sub
4:39:49
ends and before the drop down menu content ends go ahead and add drop down
4:39:56
menu separator like this we already have that imported like that and inside just
4:40:04
add a simple drop down menu item like that uh my apologies it's not a
4:40:11
self-closing tag so close it like this and all we're
4:40:17
gonna say is kick like this so let's see how that looks there we go perfect so we
4:40:22
can kick and change the roll let's just go ahead and style this a little bit so I'm going to use the Gable icon or gavel
4:40:30
gabble like that from Lucid react and let's give it a class name of h-4
4:40:38
W-4 air margin right dash 2 like this there we go so we can now kick and we
4:40:44
can change from guest to moderator and vice versa perfect and one more thing I
4:40:50
want to do you can find where this conditional content ends right here
4:40:56
and just write loading ID is identical to member.id so if we currently made any
4:41:03
axis request for this ID either kicking them or changing their role we're gonna
4:41:08
display a small spinner so go ahead and add Loader 2 from Lucid react make sure
4:41:16
you import that from Lucid react it is a self-closing tag and we're gonna give
4:41:21
them a class name of animate Dash spin text sync Dash 500
4:41:30
margin left Auto W-4 and h-4 so let me
4:41:36
demonstrate how that should look if I change this there we go so we're gonna have this little spinner so just bring
4:41:42
this back to loading ID is identical to member ID perfect so now let's go ahead
4:41:47
and let's create the functions which we are going to call uh to kick the user and change the user role so let's do the
4:41:55
role change first because once we kick the user we have to do the whole invite thing to get them back into the server
4:42:02
all right so go all the way to the top before we return anything
4:42:07
let's go ahead and write const on a roll change is going to be an asynchronous error
4:42:14
function like this it's going to accept member ID as its first parameter which is a string and a
4:42:21
roll which is a type of member role and you can import that from at Prisma slash
4:42:26
client so let me just zoom out a bit so you can see the function in one line on role change a synchronous function which
4:42:33
accepts the member ID and the role and let's find the member roll here so add Prisma slash client and I'm just gonna
4:42:40
move it to the top with the other inputs perfect so what I'm going to do inside
4:42:47
is I'm going to open a try and catch block so let's do the catch one first I'm gonna go ahead and write console log
4:42:55
error like that and let's do finally set loading ID to be an empty string
4:43:02
which means that in the try block we had to set loading ID to be member ID like
4:43:09
that perfect now let's go ahead and install a package which is going to help us with generating URL queries
4:43:16
so let's go ahead and shut down the application and run npm install query Dash string like this perfect let's go
4:43:24
to the top and let's import Qs from query Dash string like this so let
4:43:32
me run my application again npm run Dev like this and I added this import Qs
4:43:38
from query Dash string I'm going to refresh this page and let me just open this model again so
4:43:45
every time you shut down your application and run npm run Dev make sure to refresh the page perfect so let
4:43:51
me Zoom this in a bit and let's continue working with this here so let's go back inside of our own role
4:43:58
change function and let's write const URL to be Qs dot stringify URL like this
4:44:06
the first argument is going to be URL which is going to be backdicks
4:44:11
slash API slash members slash member ID like that so we are
4:44:18
going to Target this API route and we're going to add the query to be server ID
4:44:25
server question mark dot ID which we have from the data of the model store and member ID which we are going to
4:44:33
modify like that perfect so let's go ahead and let's
4:44:38
write const response to be await axios which you can import from axios so make
4:44:45
sure you do that I'm just going to move it to the top of my imports like this perfect
4:44:51
await axios dot patch URL because this
4:44:56
is going to create a string if you take a look it's going to return a string and let's go ahead and pass in the role as
4:45:04
the change perfect and after that is ready let's go ahead and call router whoops we don't have the
4:45:11
router so let's add it so at the beginning of your members model just write const router to be used
4:45:17
router from next slash navigation like this and make sure you've imported the
4:45:23
router from next slash navigation and I'm just adding it to the top with the other Imports perfect so we have this
4:45:29
router now so let's go call a router.refresh right here to update our
4:45:34
server components and then let's call on open let's see if we destructured it here so
4:45:41
we did make sure you have unopened structure from the use model right here perfect let's call the on open to call
4:45:48
this members model but all I want to do actually is update the data so I'm gonna
4:45:53
pass the server to be response dot data like this there we go so now if you try
4:46:01
well we can try anything yet we have not added that to we have not added this
4:46:06
function to any on click so companies on Roll change and let's go ahead and add
4:46:12
it where needed so I'm just going to zoom out just a bit find this roll span and go ahead and
4:46:18
find this drop down menu item which has a guest label and has this check and
4:46:24
this Shield right here and in this drop down menu item add an on click
4:46:30
let me just collapse this in a new line so on click is going to be an arrow
4:46:35
function which is going to call on Roll change to be a member dot ID and guest
4:46:44
as the role I'm changing it to so when we click on guest which is this thing
4:46:50
right here so when I click on the guest I'm going to call the honorable change passing the current member ID that I
4:46:56
clicked on and a guest as the new role for that user perfect and I'm gonna do
4:47:01
the same thing for this one where it says moderate moderator right here so on click
4:47:07
is going to be a narrow function on role change member dot ID and moderator like
4:47:14
this perfect so let's go ahead and let's try that now I'm going to open my inspect element
4:47:19
here and what I'm expecting is that when I click on guest or moderator I get a 404 error so when I click here there we
4:47:28
go we have a404 not find perfect that's exactly what we need because the route
4:47:33
doesn't exist but our local client functions are obviously working so let's go ahead and let's create that route now
4:47:41
so I'm going to close everything for Simplicity now and let's go inside of our app folder
4:47:47
inside of API and create a new folder called members like this and inside go
4:47:54
ahead and create another folder in Brackets write member ID like this and
4:48:00
inside right route dot DS like that perfect so let's go ahead and let's
4:48:07
write this patch function first so export asynchronous function patch which
4:48:14
takes in the request which is a type of request and params which are type of params which are an
4:48:21
object will have the member ID which is a type of string so just make sure that this folder member ID matches the params
4:48:28
member ID great let's open a try and catch block as always
4:48:34
let's log for development so members ID patch error like that and
4:48:42
return new next response from the server internal error
4:48:48
with a status of 500 like this perfect now inside let's get the current profile
4:48:55
await current profile like this and make sure you've imported that from lib
4:49:00
current profile like that if there is no profile in that case what
4:49:07
we can do is return new next response unauthorized and give it a status of 401
4:49:14
like that perfect if there is a no so okay so yeah what we
4:49:19
have to do now is we we're also passing some query alongside uh Our member ID so
4:49:26
before we go any further below the profile what I want you to do is add
4:49:31
const search params are equal to new URL request dot URL
4:49:38
like this and cons row is going to be whoops roll
4:49:44
is going to be await request.json like this so we need this to in order to check some more stuff perfect and now
4:49:52
let's destructure our server ID so const server ID is equal to search
4:49:58
Rams dot get server ID so just make sure you don't do any typos these two should
4:50:05
be the same server ID capital I perfect and let's go ahead and check if we don't
4:50:10
have the server ID in that case we're going to return new next
4:50:17
response saying server ID missing with a
4:50:22
status of 400 like this and now let's check if we don't have the
4:50:29
params member ID so if there are no programs.member ID let's go ahead and return new next
4:50:36
response member ID missing status
4:50:42
100 as well perfect so now let's go ahead and let's actually
4:50:48
update This Server so cons the server is equal await DB which
4:50:55
you can import from add slash libdb so make sure you do this import right here perfect I'll wait
4:51:02
db.server dot update like this where ID is server ID which we are going to get
4:51:10
from our query search params so usually we are able to do that in this programs
4:51:15
but look at our URL it's not inside of the server ID it's independent all right
4:51:22
so we have the server ID and we Define that right here and we're also going to use the profile
4:51:29
ID to confirm that only the current profile.id which is going to be the admin can modify this so data
4:51:37
members update like that
4:51:42
where ID is params.nember ID like that profile
4:51:50
ID is not the current profile dot ID so we don't want our user our admin to
4:51:57
accidentally be able to change their role if they use just the API so this is
4:52:03
just a check that whoever is updating this is not updating themselves because only an admin can update this and an
4:52:10
admin cannot change any uh change their own role so server needs to have an
4:52:16
admin that's the point that's why we do this protection all right and now let's
4:52:21
go ahead and let's just pass in data roll like this so outside of this we're
4:52:28
add a data and role like that perfect so outside of this data you can go ahead
4:52:35
and add include and what we're going to need are members
4:52:41
where we are going to need profile so include profile true and order by roll
4:52:49
ascending like this there we go and let's just go ahead and return new
4:52:55
next whoops next response dot Json server like this there we go perfect so
4:53:04
now we have this patch function which finds the server using server ID and the
4:53:10
current profile ID as an admin it looks through the members it finds the member
4:53:15
that matches the member ID param it checks that it's not the currently logged in member and then it updates the
4:53:23
data role from whatever we pass the role which is going to be either moderator or admin and it also includes the members
4:53:31
and their profiles ordered by ascending a order of role in the results because
4:53:37
we are going to need that to continue rendering this members model perfect so we have this ready let's go back inside
4:53:44
of our components models members model right here and let me just double check
4:53:50
the on a roll right here so I think this can work but I also
4:53:55
think we don't need the member ID in this query at all because we are actually sending it here so I'm going to
4:54:01
remove this from my query and let's see if this is still going to work so I'm
4:54:06
kind of confident that it's actually going to work let's change role to moderator it's loading it's loading
4:54:13
let's see there we go it's officially working I'm going to refresh the entire
4:54:19
thing just to confirm that even when I refresh there we go so this user is officially now a moderator let's try
4:54:26
bringing them back to guest there we go their Shield is gone and I'm gonna refresh again so it works 100 perfect
4:54:34
and now let's do the kick option here so the kick option is gonna be well really
4:54:40
not that difficult let's go ahead and first create the local version here so
4:54:47
after before the on Roll change in the members model or let's write const on
4:54:52
Kik which is also going to be an asynchronous arrow function which accepts the member ID as a string and
4:54:59
that's it nothing else let's open a try and catch block so if there is an error
4:55:06
all we're going to do for now is log this Arrow right here oops okay and in
4:55:11
the finally we're gonna set loading ID to an empty string which means in the
4:55:17
try first thing we do is set the loading ID to member ID like this perfect now
4:55:24
inside let's go ahead and generate our URL so const URL is equal to qs.stringify URL like that and we're
4:55:33
going to do URL to be backticks slash API slash members
4:55:38
slash member ID so the same thing that we have at the bottom and let's add the
4:55:44
query server ID server question mark dot ID and I'm pretty sure we don't need
4:55:50
that member ID which we added before perfect and now let's just go ahead and
4:55:55
write const response to be a weight axis dot delete URL like this let's call
4:56:03
router.refresh after that is finished and on open members
4:56:09
and last passing response done data as the new server data perfect now what we
4:56:16
have to do is we have to create our delete function so let's go back inside of our route which is located in API
4:56:24
members member ID route right here and let's do it above the patch function so
4:56:30
export asynchronous function delete like this it's going to take a request which is
4:56:37
request it's going to take Rams which are a type of params member ID
4:56:45
string like that and let's open a function let's open the try and catch
4:56:51
block let's do the good old uh whoops
4:56:57
console logging here so log member ID delete
4:57:05
error oops okay so all I did was wrote member ID delete error
4:57:10
and return new next response internal error with a status of 500 like this
4:57:18
perfect and now inside let's get the current profile using await current profile we already have that imported
4:57:26
and we're gonna do the same thing so if there is no profile in that case we turn new next response
4:57:33
unauthorized with the status of 401 like that
4:57:39
if whoops one more thing so we have to add the const search params
4:57:49
from new URL request dot URL like this
4:57:55
and cons the server ID is equal to search for rams.get server ID like that
4:58:01
okay so if there is no that server ID return
4:58:06
new next response server ID missing like that with a
4:58:13
status of 400 perfect now let's do if there is no programs dot member ID
4:58:20
return new next response number ID missing with a status of 400 there we go
4:58:30
and we are almost there what we have to do now is kick the server kick the member from our server so const server
4:58:37
is equal await DB which we already have dot server dot update again
4:58:44
where ID is server ID row file ID is
4:58:49
profile current profile dot ID and the data which we are going to modify is
4:58:56
going to be members like this delete many
4:59:02
ID programs dot member ID like this and
4:59:07
profile ID should not be the current profile.id so we don't want the admin to
4:59:13
accidentally kick themselves even if they just use the API so it's one thing
4:59:18
to protect yourselves on the front end but you need to do the same thing on the back end that's why regardless of the
4:59:24
fact that I'm not even rendering the horizontal dots right here for myself it's important that I also protect that
4:59:30
in the API because front-end validation can easily be bypassed make sure that you always protect your data and your
4:59:37
intended functionality on the back end as well alright so not profile ID so
4:59:43
that doesn't happen and after we're finished with this so that's good enough let's add include members include
4:59:52
raw file true like this and let's go ahead and
4:59:57
just order by whoops order by roll
5:00:05
ascending like this there we go so what we are doing is we are uh updating the
5:00:12
server which matches the server ID where the current user is the admin we are looking into the members and we are
5:00:19
going to delete members which match this member ID but not this profile ID so we
5:00:25
don't want the user to delete themselves perfect and then we include the members and their profiles because we need them
5:00:31
for this model same thing as the update function perfect so I think that
5:00:38
this should all already work let's go ahead and let's try it out so I'm gonna
5:00:43
refresh everything for good luck and I'm gonna go back to my manage members I'm going to click kick
5:00:50
and I forgot to add the click functionality okay so let's go back inside of the members model I forgot our
5:00:58
own kick is not used anywhere so let's go all the way down
5:01:03
down down find the gavel find the kick text and on the drop down menu at them
5:01:09
add on click to Be an Arrow function which calls the on click and passes in
5:01:14
the member dot ID like this perfect so again I'm gonna refresh for good luck
5:01:21
and hope for the best after I click kick we get a loading and it seems like the
5:01:27
user is still here so let's go ahead and let's see what happened it seems like I have a 500 internal server error okay so
5:01:36
the way I'm going to debug this is by looking into my terminal here and it says cannot read properties undefined
5:01:43
reading headers all right I'm gonna pause the video and I'm gonna explain to you exactly what I did and how I found
5:01:49
this all right so what I did wrong uh and how
5:01:55
I found out is I tried this request a couple of more times to confirm that I'm getting the error so I pressed kick
5:02:01
again I got the error again and what I did was I paged back inside of my route
5:02:07
where I have the delete function and I went step by step to see where could this go wrong and then I noticed that
5:02:14
I'm actually not doing anything with this server function which means that what I have to do is write return
5:02:21
nextresponse dot Json server like this so that was my mistake I forgot to
5:02:28
return anything from the API route so inside of your delete function make sure
5:02:33
that you use this server which you update and just return nextresponse.json so let's go again I'm
5:02:42
gonna go ahead refresh for good luck I'm going inside of my members and as I
5:02:48
assumed yes so now it says that it's the deleted that's because we successfully
5:02:53
actually did this part the updating and deleting what was not successful is the
5:02:59
returning of this one so our code works but just to demonstrate this I'm gonna go ahead and I'm going to click invite
5:03:06
people I'm going to copy this URL I'm going to log out and go back with my new profile
5:03:11
all right so I just logged out and I'm going to use that copied in my link in my URL let's see if there we go I'm
5:03:19
successfully part of the server now and I can only leave it because I'm not an admin I cannot manage members or invite
5:03:25
people or change the settings so I'm gonna go back and login into the admin now
5:03:30
all right I'm back you can see by my icon right here at the bottom and let's check now so manage members right here
5:03:37
there we go so I joined again and now if I try kick it should in real time remove
5:03:44
my user perfect so you successfully finished managing user managing their
5:03:49
roles kicking them and you have a nice little manage members model to see who is an admin and who is not an admin
5:03:56
perfect so you have a bunch of working functionalities already we have to do the create channel and the delete server
5:04:03
functionalities next amazing job so far so let's go ahead and let's create a
Channel Creation
5:04:09
model which is going to open when we click on this create channel button right here so first thing we have to do
5:04:15
is we have to visit our use model store so let's go inside the hooks use model
5:04:20
store right here and after members go ahead and add create channel like this and we can
5:04:28
leave the model data and everything else exactly as it is great now what I want
5:04:34
to do is I want to go inside of my components models and I'm going to copy the create server model and I'm going to
5:04:41
paste it in the models once I have that copied file I'm going to rename it to create Dash Channel Dash model because
5:04:49
it's going to be very similar let's go inside of that newly created file and go
5:04:55
ahead and rename the component to create channel model like this and change this
5:05:01
constant is model opened to check for the type create a channel like this as
5:05:06
always just make sure you're doing that in the proper file so you don't override your working create server model once
5:05:13
you've created the create channel model let's go inside of components providers model provider and let's add that to the
5:05:20
bottom after the members model so create channel model like this and make sure
5:05:26
you've imported it from DOTA slash models create channel models and you already know I'm going to replace that
5:05:32
to slash components because I prefer it that way great now that we have that let's go ahead and let's go inside of
5:05:39
our components server server header right here and let's go ahead and find
5:05:45
the drop down menu item which says create channel once you're in here go ahead and add that item and on click
5:05:52
function which is going to be an arrow function which calls the on open create channel like this great and now
5:06:00
if you go ahead and try I'm going to refresh here and if I click on Create channel there we go we have the
5:06:07
identical model to create server and now we're going to go and slowly modify it to match our create channel model
5:06:14
perfect so I'm going to close everything here let's go inside of components models
5:06:20
create channel model and let's go step by step and remove what we don't need so first thing we have to go to this form
5:06:26
schema and remove the image URL because channels are not going to have images now let's go ahead and remove that from
5:06:33
the default values in the form use form so you can remove the image URL from here as well great now let's go ahead
5:06:41
and let's find the form and go ahead and find this div which says class name
5:06:46
space Dash y-8 and px-6 and below that you're going to remove everything which
5:06:53
is just going to be this div which centers this form field which has the file upload so we are not going to need
5:07:00
that so I'm going to go to the end of that div like this and I'm just going to press remove and I'm going to remove the
5:07:06
Extra Spaces and once I save you can see how that looks so now there is no more Drop Zone here for image upload perfect
5:07:15
now let's go ahead and let's change the title from customize your server to create channel like this and we can also
5:07:23
remove the dialog description because we are not going to need it for this model that means that we can also go to our
5:07:29
Imports and remove the import for file upload because we are not going to need it and we can also remove the import for
5:07:36
dialog description because we are not going to need it as well perfect now let's go ahead and let's find the form
5:07:42
field which says server name like this so find the form label which says server
5:07:48
name and rename it to channel name like this and we also have to change the
5:07:54
placeholder in its respective input to be enter channel name like this there we
5:08:00
go so now we have a nice model which says create channel has a channel name and says enter a channel name perfect
5:08:07
what we have to do now is we have to add a new component from chat CN which is going to enable us to use it to pick a
5:08:14
type for this channel because remember number channels can have types they can be text audio or video channels so let's
5:08:20
go inside of chat CN UI right here and go ahead and find the select component
5:08:26
so it's just below scroll area for me go ahead and find the installation right
5:08:32
here copy the npm and go inside the viewer terminal I'm going to shut down the application and I'm going to go
5:08:39
ahead and add this command so let me expand my screen npx chat CN Dash UI at
5:08:44
latest add select and go ahead and press enter and confirm this installation
5:08:51
once that is done you can go ahead and npm run Dev your project again perfect
5:08:57
so I'm just going to expand this back and as always I'm going to refresh my page here
5:09:02
and once that is done I'm gonna go ahead and open my create channel model again
5:09:08
and I'm just going to collapse my screen like this perfect so let's go ahead and let's import everything we need from
5:09:14
that newly created solid Newry installed select component so just below this use
5:09:20
model I'm going to add an import from add slash components slash UI slash
5:09:25
select like this what we're going to need is the select component we're gonna need the select content we are going to
5:09:33
need the select item select the trigger and select value like this perfect so
5:09:41
now let's go ahead and let's go inside of our form schema right here and let's
5:09:46
modify the rules a little bit so let's go ahead and let's add the New Field
5:09:52
which is going to be the type of this Channel and that's going to be the only options available for this type are
5:09:58
going to come from our Prisma schema so let me just quickly visit our Prisma schema.prisma let's go ahead and let's
5:10:05
find the channel which is right here there we go we have the model Channel and in the type we have the channel type
5:10:13
so we're going to use this enum and we only want these options to be validated so let's go back inside of our create
5:10:18
channel model and let's write a Z dot native enum and inside we're going to write Channel
5:10:25
type and you can import this from at Prisma slash a client like I did right
5:10:31
here and I'm just going to copy it and move it to the top with the Global Imports like that and you can save that
5:10:37
file perfect and now let's also modify the name a little bit so it can pretty
5:10:43
much look like this but one thing I want to modify about it is that it also restricts the user from putting the name
5:10:49
General inside so only one General channel can exist perfect so after this
5:10:56
Min has been finished so after this go ahead and add dot refine like this
5:11:03
go ahead and write name to be name is not equal to General like
5:11:09
that and go ahead and open an object for a custom message which will say channel
5:11:14
name cannot be General like this so notice that I'm
5:11:19
using different types of annotations because my message is inside of this double quotes So use a single quote
5:11:26
inside because if you try and use double quotes you can see that the string ends here you can also just write this if you
5:11:34
want to but I want to be more specific by adding single quotes like this and let's also modify the error message for
5:11:41
this name so it's no longer server name its channel name is required perfect so we have modified our form schema to
5:11:47
prevent the user from writing General as the channel name and I think we can already try that out so if I type
5:11:53
General inside there we go and now it says channel name cannot be General perfect that's exactly what we wanted
5:11:59
now let's go ahead and let's add a new form field which is going to allow users to select the proper Channel type so
5:12:07
let's go ahead uh you can ignore these errors for now we're gonna resolve that later so find
5:12:14
the end of this form field right here so it's a self-closing tag so find this
5:12:20
self-closing tag and go ahead and open a new form field which is going to be also a self-closing
5:12:26
tag control is going to be form dot control like this
5:12:32
name is going to be type like that and render is going to be the structuring the field
5:12:40
option like this and it's immediately going to return a form item like this great and
5:12:48
now let's go ahead and let's just resolve this error which says that type is not assignable as a name so we did
5:12:55
add it to the form form schema but we forgot to add it to default values so let's go ahead and add
5:13:02
the type here to be like this there we go we resolve that now
5:13:08
and let's go ahead and let's see what this is going on about
5:13:13
okay so what we have to do to resolve this I'm pretty sure well if you look at
5:13:19
our schema Prisma we use a default value for the channel type here so let's go
5:13:24
ahead and let's change this from an empty string to channel type dot text
5:13:30
like this and there we go so the default channel will have sorry the default type
5:13:36
of a new channel is going to be text and then the user can switch it to something else so just go ahead in your form use
5:13:42
form default values and set the type instead of an empty string to be Channel type dot text and there we go now we no
5:13:49
longer get that error in our on submit form perfect and now we can focus back
5:13:54
on creating this form field where users can select their own type so we stopped
5:14:00
at adding this form item inside of this render prop right here so let's go inside and let's add a form label which
5:14:08
is going to say Channel type like this and let's go ahead and let's add the
5:14:16
select option which we already have imported and let's give it some props so it's going to have a disabled rocks if
5:14:23
we are loading is going to have the on value change to be field dot on change
5:14:28
and it's going to have the default value of field dot value like this great
5:14:36
now let's go ahead inside of this select right here and let's add the form
5:14:42
control which we already have imported and inside let's add the select trigger
5:14:48
component which we also have imported let's go ahead and let's give it some
5:14:53
classes so class name is going to be
5:14:58
bg-sync-300-50 border Dash zero Focus ring Dash zero tax Dash
5:15:07
black ring Dash offset-0 Focus ring Dash
5:15:13
offset-0 capitalized and outline Dash none like this there we
5:15:21
go perfect and now inside of this select trigger go ahead and add select value which we already have imported it is a
5:15:28
self-closing tag and let's give it a placeholder of select a channel type
5:15:34
like this there we go and now below this form control right here let's go ahead
5:15:41
and let's add the select content which we already have imported and let's go
5:15:46
ahead and do object.values of Channel type which we have imported from Prisma
5:15:52
dot map get individual type like this and just go ahead let me just zoom out
5:15:57
so you see how this looks in one line so just create a DOT map type which opens a render like this and inside you're gonna
5:16:05
go ahead and write select item which we have imported let's go ahead and give it
5:16:11
a key to be type let's give it a value to be type and the class name of
5:16:19
capitalize like this and inside what we are going to do is render the specific
5:16:24
type in lowercase so our capitalized class can work properly great and what
5:16:30
we have to do outside of this select but still inside the form item is just a
5:16:36
form message like this there we go and now let's go ahead and let's refresh
5:16:42
this entire thing let's go back inside of create channel and there we go you can see that my
5:16:48
channel type now has a default value of text right here perfect so what we have
5:16:54
to do now is we have to modify our on submit function so let's go ahead and find the on submit right here and
5:17:01
instead of going to slash API slash servers what we have to go is go to slash API slash channels like this
5:17:10
but it's actually not going to be just that simple so we're gonna have to add a
5:17:15
query which holds the server ID in its params so in order to do that let's add
5:17:21
a useful import Qs from query Dash string like that and then let's go back
5:17:27
to the on submit function and let's actually create a stringified URL see accounts the URL is equal to
5:17:34
qs.stringify URL like this the URL is going to be slash API slash
5:17:39
channels like we changed below and we're going to have a query which is going to hold the server ID which are going to be
5:17:47
params question mark dot server ID like this and it seems like we don't have the
5:17:52
params here so let's go ahead and resolve that before we continue so go to the top of your function here or
5:17:59
actually you can do it below this use router and just add cons params to be used params from next slash navigation
5:18:05
so make sure you did this import use params and use router from next slash navigation great and now that we have
5:18:12
the params the error should no longer be visible here perfect and now change this
5:18:17
hard-coded URL here to this new constant URL which is going to append this server ID query so we know where to create that
5:18:25
channel perfect it seems like our model is now ready to call an actual API route
5:18:32
so let's go ahead and create that first and you can already try it out so now if I open my Instagram the element here if
5:18:38
I try like this I get an error if I type General I also get an error but if I try test Channel I should get a 404 error
5:18:47
like this so let's resolve that so we actually uh go to an existing route I'm
5:18:52
going to close everything here I'm going inside of my app folder inside of API
5:18:57
and here I'm creating a new folder called channels like this and inside I'm
5:19:03
going to create a new file route.ds like that let's go ahead and let's write export asynchronous function
5:19:10
post like that which holds the request to be a type of request like this go
5:19:16
ahead and open a try and catch block as always let's go ahead and write console
5:19:22
log channels posts and error like this and
5:19:27
return new next response from next slash server internal error
5:19:33
with a status of 500 like this perfect it will resolve the catch and
5:19:40
now let's go ahead and get the current profile subconscious profile is equal to await current profile from s slash lib
5:19:47
current profile I'm just going to separate those inputs like this great and let's go ahead and let's destructure
5:19:55
the name and type from the body so name and type which we are going to send from the form we can get from a weight
5:20:01
request.json like that and let's get the search programs so this structure search params
5:20:09
from new URL request.url like that and now let's go
5:20:14
ahead and write const server ID to be equal to search params.get server ID like this there we
5:20:22
go let's go ahead and check if we have no profile found in that case we can return new next
5:20:30
response unauthorized with a status
5:20:36
of 401 like this now let's go ahead and check if we have no server ID in that case returning new
5:20:44
next response missing server ID missing like this with
5:20:50
a status of 400 invalid requests like that and now let's check if the user bypassed
5:20:58
the front-end validation and actually manage to send an API request with the
5:21:03
channel name General we don't want that to happen so let's write if in name is equal to General
5:21:10
in that case return new next response name cannot be
5:21:17
General with a status of 400. so let me just
5:21:23
briefly explain why am I doing this General protection so it's not like I don't want users to have a general one
5:21:29
and general two so General two is completely fine I'm doing this because later on when a user visits a server
5:21:35
we're going to automatically redirect them to a general channel so that's why I'm protecting this name so our code can
5:21:43
stay working perfect you can of course after you finish this entire project play around with the
5:21:48
settings and modify them to your liking now let's go ahead and let's actually create this Channel and update the
5:21:55
server accordingly so this is going to be a bit different because both the moderator and the admin can add new
5:22:01
channels so we're gonna write a bit of a different query const server is equal to
5:22:06
await DB let's import dib from ldb from add slash lib slash DB so make sure you
5:22:12
do this import right here db.server dot update like this where ID
5:22:20
is equal to server ID members is equal to sum raw file ID
5:22:28
to be profile dot ID so what we've done so far is we created a query that only a
5:22:35
member can add a new channel and now we're also going to check that that member also needs to have a role in open
5:22:43
an array member role which you can import from at Prisma slash client so
5:22:49
make sure you do this import right here I'm gonna move it to the top we're only going to allow it to members
5:22:54
who are either an admin or member role who is either a moderator so only those
5:23:00
two can do that perfect so now once we finish with our aware query we can go
5:23:05
ahead and add the data we want to update the data we want to update is just channels
5:23:11
create profile ID to be profile dot ID
5:23:18
and name and type like this there we go and now let's go
5:23:25
ahead and just write return nextresponse.json Server Like This
5:23:32
perfect so now we can go ahead and actually test this out the only problem
5:23:37
is we are actually not listing our channels anywhere so let's go ahead and
5:23:43
open our Prisma studio so we can look at the data in the database so I'm going to open a new terminal and write npx Prisma
5:23:50
Studio like that that's going to open a Prisma studio for me and you can click on this little plus
5:23:58
icon here or just close everything and you will see this options right here and click on Channel right now if you have
5:24:05
only one server you should have the initial General Channel which was created when we created the server and
5:24:12
now let's go ahead and test that if once I click this create channel it's going to work so I'm going to write test Dash
5:24:19
Channel and let's keep the type to be text I'm clicking create
5:24:24
okay it seems like it's working let's refresh this Channel and we should have two channels now there we go test
5:24:31
channel right here and you can see that they're matched to a profile and they are also matched to the server perfect
5:24:37
so our Channel creation officially Works beautiful so we actually have two more
5:24:43
actions to do one is the delete server and the other one is to leave server
5:24:49
which is an action that only guests have perfect so let's go ahead and do that
Delete & Leave server modal
5:24:55
so let's go ahead and let's create a model for the lead server and for the
5:25:01
lib server model so first one I actually want to do is leave the server model
5:25:06
because once we delete this server that is automatically going to delete all the members as well so make sure that once
5:25:13
you click on manage members you have at least one more member inside so that's what I'm going to do now I'm going to go
5:25:19
ahead and click invite people I will copy this URL and I'm going to log out go into another account and paste this
5:25:26
URL inside of my browser so I become a new member of this server
5:25:33
all right so I logged out and I'm not part of any servers in this account so I
5:25:39
get this prompt to create my own server I'm going to paste that invite link inside of my URL here and now I should
5:25:45
join uh the code with Antonio server there we go and now the only option I have here is leave server so let's go
5:25:53
ahead and let's do that option here perfect so first thing we have to do
5:25:59
obviously is we have to go inside of a hooks use model store and after create
5:26:06
channel add leave server like this so just leave server and we can leave the
5:26:13
model data and everything else exactly as it is perfect so I'm gonna go ahead
5:26:18
inside of my components models and I'm actually going to copy this invite model
5:26:23
because it's the simplest of all of this so we can easily modify it to match our simple uh yes or no model so copy the
5:26:31
invite model and rename it to leave Dash server Dash model like this make sure
5:26:36
you are inside of that file and rename the invite model to leave server model
5:26:42
like that and change this is model open to use the leave server like this now
5:26:48
let's go ahead inside of our providers model provider and let's add that new
5:26:53
one to the bottom so leave server model like this there we go and I'm just going
5:27:00
to rename this to add slash components like that perfect so now let's go inside
5:27:06
of our components a server server header right here and not the delete server but
5:27:12
the leave server which only guests can see inside add on click Arrow function
5:27:19
on open leave a server and pass in the data of server inside of an object in
5:27:27
the second argument like this because we need to know what server to leave great so now if I go ahead and try and click
5:27:35
leave server there we go the invite friends model is opened so I'm going to keep this opened and now let's go ahead
5:27:42
and let's slowly modify this so go inside of components models leave a
5:27:47
server model like this let's remove the origin we are not going to need that which means we can also remove the
5:27:54
invite URL like that we can remove the on copy function and we can remove the on new
5:28:01
function like that and inside of here you can go ahead and you can remove
5:28:08
everything inside of this div right here so let's do it that way I think it's
5:28:13
going to be a bit simpler like that so just have uh this div have this
5:28:19
simple dialog dialog content header title and I'm just going to say leave a server inside there we go now let's go
5:28:27
ahead and let's change this title from invite friends to be leave server like
5:28:33
this below this dialog title let's bring back our dialogue description from add
5:28:38
slash components UI dialog so don't accidentally import it from Radix so there we go dialog description okay and
5:28:46
inside I'm going to write are you sure you want to leave I'm going to add a
5:28:51
span element and I'm gonna go ahead and write a server question mark dot name
5:28:57
like this and question mark at the end so now it says are you sure you want to leave edit
5:29:03
the server which is what we renamed our server great and let's go ahead and give
5:29:08
this span a class name of font.s semi bold and text Dash Indigo
5:29:15
Dash 500 like this so now it says are you sure you want to leave edited server and let's give a class name to this
5:29:22
dialog description here to be text Dash Center and text sync Dash 500 like this
5:29:29
there we go so are you sure you want to leave and the name of the server here so we already have the server destructured
5:29:35
from the data because this was copied from the invite model server perfect so let's go ahead now
5:29:42
and let's add a dialog of footer so go outside of this dialog header right here
5:29:48
and we're going to remove this div and we're going to add dialog footer from
5:29:54
add slash components UI dialog like this so make sure you have that imported
5:29:59
great and let's go ahead and give this dialog footer a class name of BG Dash
5:30:05
gray Dash 100px-6 and py-4 like this and let's go
5:30:12
ahead and add a div inside with a class name of flex items Dash Center justify
5:30:18
Dash between and W Dash full like this inside of that div we are going to
5:30:24
create two buttons so add a button we already have it imported uh if you
5:30:31
want to confirm just make sure you have button from add slash components UI button so you should have this because we copyed this from the inlight model
5:30:38
and let's add cancel here like this and let's copy and paste the button below
5:30:43
that and this one is going to be confirmed like this there we go so they are now on the sides and for this first
5:30:50
one let's go ahead and let's give it a proper disabled to be is loading do we have is loading we do okay on click for
5:30:58
now is going to be just an empty function and variant is going to be ghost like this
5:31:05
this one is going to be quite similar so disabled if we are loading the request variant is
5:31:13
going to be primary and on click
5:31:18
is going to be an empty Arrow function for now great so let's see where we get
5:31:24
this loading from okay that's here we don't need this copied state so we can
5:31:29
remove that like this and we actually don't need to destructure on open from the use model
5:31:35
and everything else can actually stay the same let's just clean up our Imports so we don't need to use origin we don't
5:31:42
need the input we don't need the label and we don't need this Lucid react icons
5:31:49
but we are going to need access so leave that here great now let's go ahead and
5:31:54
and let's actually use this on close button into this first button which says cancel
5:32:00
so instead of an empty Arrow function I'm going to write on close here so now once I click on cancel here it should
5:32:07
close the model and once I click again it should open it perfect so that's what we want and now let's do the confirm
5:32:13
function here so I'm going to go to the top right here and I'm going to write const on click
5:32:19
to Be an asynchronous Arrow function open a try
5:32:26
and catch block for now just log the error
5:32:31
like that and in the final Block Set is loading two false which means in the try
5:32:37
one we are doing set is loading to true and then a weight axis which we have
5:32:44
imported dot batch backticks slash API slash servers slash
5:32:50
open an object server questionnaire dot ID slash leave like this and then call
5:32:56
the on close function router.refresh oh we don't have the router so let's go ahead and below the
5:33:02
use model add const router to be used router from next slash navigation so this import right here I'm just gonna
5:33:09
move it to the top there we go router from next slash navigation so we have the router now and now we can
5:33:16
call router.refresh and let's do router.push
5:33:21
do a slash like this perfect so now if I go ahead
5:33:28
and actually we did not assign this on click so let's just assign this on click to this second button instead of this
5:33:34
empty Arrow function like that okay so now if I open my inspect element I'm pretty sure I'm going to get a 404 error
5:33:42
there we go patch 404 not found so let's go ahead and let's actually resolve this
5:33:48
now so we're gonna go ahead and close everything we're gonna go inside of the app folder API servers server ID and
5:33:57
create a new folder called leave like this and inside create route.ds like
5:34:03
that there we go so let's write export asynchronous function batch like that
5:34:10
with the request and let's extract the params
5:34:16
Rams is an object of server ID string like that let's open a try and catch
5:34:23
error block and let's just cancel log
5:34:31
server ID leave error so we know where it's coming from in development and
5:34:37
let's return new next response from next slash server internal error
5:34:43
with a status of 500 like that great now let's go ahead and get the current
5:34:49
profile silicon's profile is equal to await current profile from add slash lib
5:34:55
current profile and I'm just going to separate these Imports like that uh if there is no profile
5:35:01
and let's go ahead and return new next response
5:35:07
unauthorized like that with a status of 401. great if there are no params that server
5:35:15
ID in that case return new next response server ID missing like that with a
5:35:22
status of 400 like this great so let's just do
5:35:29
this and let me expand my window a bit okay great now let's go ahead
5:35:35
and let's write const server equals await DB which you can import from s slash lib slash DB so make sure you have
5:35:42
this import and it's going to be db.server.update
5:35:48
where ID is params.server ID and profile ID is not
5:35:57
profile.id so we ensure that admin cannot leave the server themselves so
5:36:02
any profile ID is okay but not the profile ID that created the server aka
5:36:08
the admin okay and now when we solved where is the ID what is the profile ID
5:36:15
let's also solve the members so only members can actually leave this so let's
5:36:20
write members sum profile ID to be profile dot ID like that and then
5:36:29
we can write data members delete many
5:36:35
profile ID profile dot ID like that great so let's take a look so we are
5:36:42
updating the server that matches the server ID we are only doing this if the
5:36:47
person leaving the server is not the person who created the server aka the
5:36:52
admin we are confirming that the person who is trying to leave the server is actually a part of the members and then
5:36:58
we are deleting that profile we are deleting that member using the matching
5:37:04
profile ID from the members list perfect and let's just do uh return next
5:37:10
response dot Json server like this so now if I go ahead
5:37:17
and try and click confirm we have a loading State and I should be
5:37:24
refreshed and there we go I'm not a part of any server which means that I have to
5:37:29
create a completely new server so I'm just going to do that quickly I'm going to use this image from unsplash and I'm
5:37:35
going to create my other profile server here
5:37:41
like this and there we go so now I'm just a part
5:37:47
of this other server perfect and now you can either create a new server like I just did or you can log out and go into
5:37:54
uh what for me is code with Antonia server basically I want you to be in a server where you are an admin so that we
5:38:01
can do this delete server function now so I'm gonna do this inside of this account you can log out and go back to
5:38:08
the old one where you are the admin basically just make sure you have the delete server function because that's the only one left here
5:38:15
so let's go back inside of our user Model A store so I'm going to close
5:38:21
everything here go inside of hooks use model store and after leave server add a
5:38:28
delete server model like this no need to modify anything else great and now we
5:38:35
can copy and paste this leave server model because it's a very simple confirm
5:38:40
or cancel model and we can easily reuse it so I'm gonna go ahead and write delete server Dash
5:38:47
model like this and let's name this delete server model
5:38:52
and let's change the is model open constant to be delete server like this
5:38:58
there we go and now let's go ahead and let's add this to our components
5:39:03
providers model provider right here so at the bottom I'm adding delete server
5:39:09
model like that and I'm going to replace this import with ADD slash components like this now
5:39:16
let's go ahead and let's go inside of components a server server header right here find the delete server one and add
5:39:25
on click to be a narrow function which calls on open and it says delete server and let's
5:39:32
also pass in the server as the data like this there we go so now if you try make
5:39:38
sure you're an admin of This Server so you have all these options and click delete server and there we go it says
5:39:43
leave server right and instead of saying leave server it's actually going to say
5:39:49
delete the server so let's go inside of our models find the delete server model and there actually isn't too much to
5:39:56
modify here so let's go ahead and let's find our text that says are you sure you want to leave and instead of leave
5:40:04
well actually we're not going to do this let's first change uh the title which is going to say delete
5:40:11
server like this and now let's change the description to say are you sure you want to do this
5:40:19
like that add a break like this and then add a span which is going to say server
5:40:26
question mark dot name will be permanently
5:40:33
deleted like this and let's give this span a class name of tax Dash indigo-500
5:40:41
and font semi bold like this so let's see how that looks now
5:40:46
once I click on delete server there we go are you sure you want to do this server name will be permanently deleted
5:40:54
great and now let's go ahead and let's just change the on click here so instead
5:41:00
of going to uh patch server server ID leave is going to do access dot delete
5:41:07
slash API slash servers and no need for the leave one so we are going to add a new delete function inside of our
5:41:13
existing route for update where we already have this route we use it to update the server so now we're just
5:41:19
going to add a new one to delete one great so let's do that route now I'm gonna close everything make sure you
5:41:25
save that file go inside of app API servers server ID and in this route.ds
5:41:32
like this so we already have the patch function here so what we can do is we
5:41:37
can just copy that patch function
5:41:44
okay let me just see I changed something here just a second okay so basically just find this patch
5:41:51
function here and you can go ahead and copy the entire patch function and just
5:41:56
above that paste it like this and rename this patch to delete like this perfect
5:42:02
now our delete function is going to look for the current profile but no need to look for this information because we're
5:42:08
not going to have it perfect and this one is going to be a bit simpler so no need to pass any data
5:42:15
and instead of using db.server.update we're just going to do dot delete like this there we go and
5:42:23
instead of server ID patch is going to be server ID the leaf in the sketch function so a very simple delete
5:42:28
function which we copied from this patch function perfect and I think that this should uh already work
5:42:36
let's go ahead and try this out so now once I click confirm it's loading and it
5:42:42
should be a similar action uh when I left one there we go so now it works we officially have no servers so I'm gonna
5:42:49
go ahead and create uh my another server I'm going to call it code with Antonio 2
5:42:57
like this let's go ahead and let's just quickly
5:43:02
confirm that all of our actions are working so we have in white people I can generate new links with no errors I can
5:43:10
go ahead and change the server settings so code with Antonio 3 and save that for example there we go it works it works
5:43:19
here as well I can manage members like this perfect I can create a new channel
5:43:25
that works and I can delete this server perfect so you completely finished all
5:43:31
the actions needed both for the guest View for the moderator View and for the
5:43:36
admin view great great job so now let's go ahead and let's create
Search Server Modal
5:43:43
an item below this uh drop down right here which we are going to use to search
5:43:49
for our items so I'm talking about this space below this code with Antonio navbar right here so we finished all of
5:43:56
these drop down items so now we're gonna create a new component which is going to be used to search uh throughout the
5:44:03
entire server so let's go inside of our components let's go inside of server
5:44:08
server sidebar right here and what we have to do is we have to go below the
5:44:14
server header here and add a scroll area from dot slash UI scroll area so I'm
5:44:21
going to replace this with Slash components UI scroll area like this great let's go ahead and give this
5:44:28
scroll area a class name of flex-1 npx-3 and inside create a div with a
5:44:36
class name of margin top to like that and inside of that div the first item we
5:44:42
are going to add is server search like this if we save we are going to get an
5:44:47
error because server search is not defined so let's go inside of This Server folder and create a new file a
5:44:54
server-search.psx like this mark this as us client and go ahead and Export cons
5:45:00
to server search and just return a div saying server
5:45:06
search component like this now go back to your server sidebar and import This
5:45:11
Server search from dot slash server search like this so same thing we did with the header and now the error should
5:45:18
go away and while you're developing this please be in desktop mode so you can actually see This Server search
5:45:24
component here so either expand your screen or zoom out a bit great
5:45:29
so now let's write the interface for the server search so go back inside of the server search component right here and
5:45:36
let's create an interface server search props like this so it's going to have a
5:45:42
data which is going to be an object which is going to be an array like this and now let's fill in this data right
5:45:49
here so it's going to have a label which is a type of string it's going to have a type which is going to be either a
5:45:55
Channel or a member like this and it's going to have its own data which is
5:46:01
going to have an icon which is react.react node it's going to have a name which is a string and it's going to
5:46:08
have an ID which is a string as well and this is also going to be an array like this pipe undefined like this there we
5:46:16
go so now let's go ahead and let's just destructure this data here so data and
5:46:22
let's assign this props right here server search props like this great so
5:46:29
now we have to go back inside of server sidebar and we actually have to fill that data
5:46:36
property here before we do that let's go ahead and let's create some icon Maps right here so I'm going to go below this
5:46:42
interface in the server sidebar and I'm going to write const icon math
5:46:48
like this and I'm going to write Channel type
5:46:53
which we already have imported here so make sure you have Channel type from at Prisma slash client like that so if
5:46:59
Channel type is text we're gonna go ahead and render an icon of hashtag so hash from lucidreact so
5:47:07
make sure you import the hash from lucidreact and I'm just going to move it to the top right here so make sure you
5:47:14
have this great so we have this hash now and I'm just going to expand my screen a bit and zoom out even more just so I can
5:47:21
see this sidebar here and I'm gonna give this Hash a class name of margin right 2
5:47:28
h-4 and W 4 like this let's go ahead and copy this two more times the second one
5:47:34
is going to be audio and the last one is going to be video like that
5:47:40
and let's also not forget to add the commas at the end of these objects here great so now we have the audio and let's
5:47:47
give this a mic icon so a microphone and let's give this one a video icon so all
5:47:53
of them are from lucidreact make sure you have uh those imported so hash mic
5:47:59
and video from lucidreact great so now that we have the icon map let's go ahead and write const roll icon map like this
5:48:07
and in here we're gonna work with member roll so add that from Prisma client as
5:48:12
well make sure you have it imported here at the top so if member row is guessed
5:48:19
we are not going to display any icon so you can just right now now if member row
5:48:25
is moderator in that case we're gonna go ahead and we're going to render
5:48:30
a shield check from Lucid react so make sure you have the shield check
5:48:37
imported from lucidreact like this and let's go ahead and give it a class name of h-4 W-4 margin left-2 like this text
5:48:48
Dash indigo-500 and that's it and actually not margin left but margin right my
5:48:54
apologies like this so let me expand this even more to see if I can fit that in one line basically it's supposed to
5:49:01
be like this just in one line and just copy it one more time and change this moderator role to admin like this and
5:49:07
instead of a shield check it's going to be Shield alert from Lucid react and don't forget to add a comma right here
5:49:15
for the moderator so we have the guest which is now moderator which is Shield check and admin which is Shield alert so
5:49:22
make sure you have a shield alert Shield check video mic and hash imported from Lucid react right here perfect so now
5:49:30
that we have here now that we have both the icon map and the role icon map we can go ahead and we can actually
5:49:36
generate the data needed for the server search because we have the text channels audio Channels video channels and members so
5:49:44
let's go ahead inside of This Server search here and let's write data
5:49:49
which is going to be an array of objects so first object is going to have a label
5:49:54
of text channels like this it's going to have a type of Channel
5:50:00
it's gonna have its own data which is going to be text channels question mark.map get the individual Channel like
5:50:08
that and return an immediate object like this
5:50:14
with an ID of channel.id name of channel.name and icon of Icon map
5:50:21
Channel DOT type like this so make sure you don't accidentally use the role icon map
5:50:29
we are only using icon map for now for these channels great so you can copy and
5:50:34
paste this just add a comma here like this the second one is going to be voice
5:50:39
channels so uh inside of our system we're going to call them audio channels
5:50:44
but I think for a user experience it's maybe better to call than voice channels right so type is still Channel but
5:50:52
instead of rendering sorry iterating over text channels we are now iterating over audio channels which we have
5:50:58
separated in this constant right here by filtering through Channel type great and
5:51:04
this can stay the same and now let's go ahead and copy this one more time
5:51:09
just remember to add a comma here this one is going to be video channels like
5:51:14
this and instead of audio channels it's video channels like that so just make sure you have both sex channels audio
5:51:21
Channels video channels and also a constant form members here so let's go
5:51:26
ahead now and let's add the last element here so add a comma and you can copy and paste
5:51:32
this like this and instead of a label being video channels the label is just going to be members like this and type
5:51:39
is going to be member because we are no longer working with channels here so we know how to work if user clicks on that
5:51:47
in the search and instead of iterating over video channels we are going to iterate over members like this and
5:51:53
instead of using uh the channel name for this we're going to call that member like that so it's going to be member dot
5:52:00
ID name is going to be member.profile.name and icon is going to
5:52:05
be not icon map but a role icon map and not channel.type but it's going to be
5:52:11
member dot roll like this there we go perfect so we have everything needed for
5:52:18
our server search component you should have no errors here if you've written this interface correctly and now let's
5:52:25
go ahead unless you actually style This Server search so it doesn't just say uh server
5:52:32
search like it does now if I zoom in it's just saying a server search component so let's just modify that a
5:52:38
little bit so I'm gonna go ahead and remove this and add a fragment instead
5:52:43
and I'm going to add a native HTML button element which is gonna have a paragraph in which we will say search
5:52:50
like this and let's go ahead and click this button a class name so this button
5:52:56
is going to be have a class name of group px-2 py-2 rounded Dash MD Flex
5:53:04
items Dash is Center like this Gap Dash X-2 like this W Dash pool hover BG Dash
5:53:14
sync Dash 700-10 on dark mode hover is going to be
5:53:20
BG Dash sync-700 slash 50 like this and it's
5:53:27
also going to have a transition like that great now let's go ahead and you
5:53:33
can see how that looks when I hover quite nice effect and now let's go ahead and give this a paragraph actually let's
5:53:40
go above the paragraph and let's just add a search icon from Lucid react it is a self-closing tag and make sure you
5:53:46
have search from lucidreact imported and let's go ahead and style it by giving it
5:53:52
a class name of W-4 h-4 text sync-500 and on dark mode is going to be
5:53:59
text sync Dash 400 because it looks just a tiny bit better and we like details
5:54:05
and now let's go ahead and do the class name for the paragraph So paragraph is
5:54:11
going to have a class name SM
5:54:17
text Dash sync 500 like this dark is going to have text Dash sync Dash 400 to
5:54:26
match the icon group Dash hover so when we hover on the button text sync sync
5:54:33
sync 600 is going to change the color to button dark mode on Hover
5:54:40
BG is going to change uh oops my apologies so we're not here yet
5:54:46
so after the group Dash hover text sync 600 uh go ahead and write dark
5:54:54
group Dash hover text Dash sync Dash 300 like
5:55:02
this and just add a transition like that great so let's go ahead and let's see
5:55:08
how this looks there we go great great and now let's go ahead below this
5:55:16
paragraph and let's go ahead and add a kbd element like this which is just
5:55:22
going to say a span like this and inside you're gonna go ahead and write CMD like
5:55:29
this or control so I'm using Mac so I'm going to write CMD like this and then K
5:55:35
like this it's going to be a shortcut okay and let's go ahead and give this CMD a class name of backslash extra
5:55:43
small like this and let's go ahead and write a big class name for this kbd so
5:55:50
class name is going to be pointer Dash events Dash
5:55:55
none inline Dash Flex h-5 select
5:56:03
Dash none items Dash Center Gap dash one
5:56:08
rounded border so just border to activate the Border BG
5:56:15
Dash muted like that PX is going to be 1.5 font is going to
5:56:23
be mono text is going to be of 10 pixels so very
5:56:28
small text like this font is going to be medium
5:56:34
text is going to have a muted foreground color opacity uh actually we don't need
5:56:42
opacity and let's just do ml-auto like this there we go great so you can see how we
5:56:48
have a nice little shortcut here great so that was a lot of code for just
5:56:55
this but I think it's worth it because it looks quite nice here but one thing I want to replace I don't want to write
5:57:01
this CMD like this I actually want to use a small little icon for that but I'm
5:57:07
not sure what is the shortcut for it so I just copied it and paste it from my project right here and you can see let
5:57:13
me just expand to show you how this looks now you can see that now it looks much
5:57:18
better right um I'm not sure how to do that icon so you can go to my project and just copy
5:57:24
it or you can leave this as CMD or you can leave it at control depending on
5:57:30
whether you're using Windows or MacBook right but I want to use that small little icon because I think it just
5:57:36
looks nicer but I'm just not sure how to display that uh manually so how to do a
5:57:42
shortcut which triggers that icon so decide for yourself whether you want to use this icon you can copy it from my
5:57:49
GitHub or you can just do control like this so I'm going to leave it at the icon and now let's go ahead and let's go
5:57:55
inside of chat cnui here and let's find the command so we have to use this
5:58:01
command component right here this is what it's going to look like and let's find the installation so copy it for npm
5:58:08
like this let's go inside of our terminal here I'm going to shut down Prisma Studio we no longer need that so
5:58:15
I can just shut down that terminal as well and let's install npx chat cnui at
5:58:20
latest add command like this so just press y to confirm this installation
5:58:26
and after that is done you can go ahead and run npm run Dev again great so I'm
5:58:34
going to close this uh and let's go ahead and just refresh
5:58:39
our Local Host here I'm just going to expand it a bit and what we're going to do now is we're
5:58:45
going to add a state right here in the server search cons open set open to be
5:58:52
use state from react and default value is going to be false so import this U
5:58:58
state from react right here perfect and now let's go ahead
5:59:03
and let's add an on click to this button to trigger on click
5:59:08
an arrow function set open to be true like this great and outside of this
5:59:16
button right here let's go ahead and let's add command dialog
5:59:22
from dot dot slash UI slash command like this so make sure you have the command
5:59:28
dialog from dot dot slash UI command and I'm going to replace the slash components like this and separate it
5:59:34
from the other inputs perfect let's go ahead and give it an open prop to match our open and on open change is
5:59:41
going to be set open like this great let's go ahead and write command input
5:59:47
here from add slash components UI command it is a self-closing tag make
5:59:52
sure you have it imported here so everything we're gonna import is going to come from this right here
5:59:59
let's go ahead and let's give this a placeholder of search all channels and members like
6:00:06
this and now go ahead and add command list from s slash components UI command
6:00:13
so make sure you have that and go ahead and add command empty
6:00:20
from add slash components UI command again just confirm that you have that
6:00:25
and inside you're going to write no results found like this and let's see if
6:00:30
we can already test this so I'm gonna go ahead and click and there we go you can see that when I click on the search it
6:00:36
opens this small little model so I'm actually going to keep it open like this great
6:00:41
and now let's go ahead and let's iterate over our data here that we are passing
6:00:48
so all channels all tags channels audio video channels and members so outside of
6:00:53
the command empty at data.map go ahead and destructure the label type
6:00:59
and data like this and go ahead
6:01:05
open an arrow function right if data length
6:01:11
return null so if there are no items we can just return null otherwise go ahead
6:01:16
and return a command group from add slash components UI command so make sure
6:01:22
you have command group imported here and inside let's go ahead and give it a
6:01:28
key of a label and let's give it a heading of label as well
6:01:35
and let's go ahead and let's write data question mark.map so this is this inner
6:01:42
data now question mark.map and go ahead and destructure the ID icon and name
6:01:50
like this okay and return
6:01:58
command item from add slash components UI command so again make sure you have
6:02:04
that imported as well let's give the command item a key of ID like that let's
6:02:10
go ahead and render the icon and let's go ahead and write span
6:02:16
name like this there we go perfect and now let's go ahead
6:02:24
and let's write our own click functions which are going to activate once we click on this individual command item so
6:02:30
you can see how this looks so I only have the general channel here so that's the only thing showing but if I create a
6:02:35
new channel let's say an audio Channel and write test audio so let's create that because we finished
6:02:41
all of that and if I try now you can see that I have a voice Channel and if I go
6:02:46
ahead and create a video channel saying test Dash video here you can see that in my search I now have
6:02:54
a video channel audio Channel and a general Channel and one more thing I'm going to show you is I'm gonna go ahead
6:03:00
and invite some people here so I'm going to go here I'm going inside of my other account and
6:03:06
I will invite myself so I just joined uh sorry I logged in into another account I'm pasting the
6:03:12
invite link right here and there we go now I am a guest here
6:03:17
and you can see that I can see the other members now and you can see how this one has a shield icon right here because
6:03:24
they are an admin perfect so what I want to do is I just want to actually go back
6:03:29
to my admin view uh rather than this one perfect and while we're here it seems to
6:03:35
me that we are showing an indigo color for this admin so let's just quickly fix that so keep this open and go back
6:03:42
inside of your server sidebar and find the role icon map right here and for the
6:03:48
admin instead of text Indigo use text rows because it should be red there we
6:03:54
go so now it looks better now it's indicating that this is an admin right here perfect so now log out and go back
6:04:02
into the admin of this account sorry this server great so I am back as an admin here and
6:04:09
if I click on search you can see that I can see the guest member right here and you can try and search and you can see
6:04:15
that it works for video audio General so absolutely amazing users can Now
6:04:22
quickly access any server sorry any channel or member inside of this project perfect what I want to do now uh is well
6:04:30
first let's actually create this shortcut that when we press command key or control key it actually opens this
6:04:37
without us needing to click manually here so go back inside of your server search component which is located inside
6:04:43
of components server server search right here where we have all these command
6:04:49
items and let's go at the top right here just below the use State and let's
6:04:56
create a use effect so use effect from react
6:05:02
like this make sure you imported use effect from react and inside let's write
6:05:08
const down to be an event of keyboard event like
6:05:13
this and let's go ahead and write if event dot key
6:05:20
is equal to K and e dot meta key
6:05:28
or E dot control key like this so if
6:05:33
that's the case in that case go ahead and E dot prevent default and set open
6:05:43
reverse of the current state like this and now go ahead and write document that
6:05:49
add event listener like this key down activate the function down and on Mount
6:05:57
on unmount go ahead and write document remove event listener on key down
6:06:06
bend the down function like this so let me just expand my screen so you can see this use effect so
6:06:13
we are watching for the TK and The Meta key or the control key and then we
6:06:18
trigger the manual open and we add that listener to the document and we return The Listener to prevent overflows so now
6:06:25
if I try command key you can see that it opens my command to search General and
6:06:32
other stuff right here and I can also click on it manually beautiful job so I
6:06:37
can actually trigger that manually now which is great and let me just zoom that in
6:06:42
what we are going to do now is we're going to create functions uh which are going to happen once we select any of
6:06:49
these items so we want to redirect to those channels or to those members so let's go ahead and let's add the
6:06:55
parameters and the router so const router is equal to use router from next slash navigation and cons params is
6:07:02
equal use params from next slash navigation as well so make sure you have us params and use
6:07:09
router from next slash navigation like this great and now what I'm going to do is write an
6:07:16
on click function just below this use effect so const on click like this
6:07:22
let's go ahead and accept the ID and the type in this function and let's write
6:07:27
the props for that which are going to be ID ID of type string and type is going to
6:07:35
be Channel and let me just expand my screen
6:07:41
so Channel or member like this
6:07:47
and let's go ahead and open this function like that so let me zoom out so you can see how this is
6:07:53
supposed to look so we have an ID and type and the type of ID is string and the typo can only be Channel or member
6:08:00
like this and once we select something we're going to turn off that command so
6:08:06
set open is going to be false like that if Skype is equal to member in that case
6:08:12
we're going to return router.push open back takes slash servers
6:08:21
slash Brands question mark dot server ID slash conversations slash ID of that
6:08:29
member like that and if type is its channel in that case
6:08:35
we're going to return router.push backticks slash servers
6:08:41
slash params question mark.server ID slash
6:08:46
channels slash ID like that perfect
6:08:52
so now if you try well first we can try it we have to assign this on click to
6:08:58
the command item so go ahead and find the command item which currently only has the key ID and add on select
6:09:06
to Be an Arrow function which calls the on click and passes in the ID and the
6:09:13
type like this so I'm going to zoom out so you can see it in one line so command item has the key and on select on click
6:09:19
and passes in the ID of that current item alongside with the type of the
6:09:25
group which it is in so it is a channel we are going to react we are going to redirect the slash channels if it is a
6:09:32
member we are going to redirect to slash conversations and then that members ID so if you try any of those right now
6:09:38
you're going to get a 404 request on General there we go a404 request and if
6:09:45
I try on a member there we go as well a404 request that's because none of
6:09:50
these Pages exist yet we have not created any chat Pages yet but all of these are gonna be chat Pages great so
6:09:57
you finish the second component here and now we can go ahead and actually render our channels and the rest of our members
6:10:04
in this sidebar so now let's go ahead and let's create a list of our channels and our members in
Server Channels List
6:10:11
this sidebar right here so make sure you are in desktop mode so that you can see this sidebar here I'm going to close
6:10:18
everything and I am going inside of my components a server server sidebar right
6:10:25
here so last thing we did was this server search right here so what we are going to do now is a list of all of our
6:10:33
channels so let's go ahead and find the end of this div which holds the server search so right here but still inside of
6:10:41
the scroll area and let's go ahead and let's add the separator from dot dot slash UI separator so don't accidentally
6:10:48
import that from Radix so I'm going to change this to add components like this and I'll just move it with the other
6:10:54
stuff up there and let's go ahead and give this separator a class name of BG
6:11:00
Dash sync-200 on dark mode it's going to use VG Dash sync Dash 700 rounded Dash
6:11:09
MD and my-2 like this great and I'm just going to refresh this
6:11:16
and there will you should see a very small line here so now let's go below this separator here and let's write text
6:11:25
channels.length like this and go ahead and add double exclamation points at the
6:11:32
start and add a question mark here so we are going to turn this into a Boolean right so this is going to result to
6:11:38
either true or false so if the length is a positive number that means that we can
6:11:43
go ahead and render the text channels and if it is a negative number it's going to turn into a false meaning that
6:11:49
we will not render those channels so go ahead and write and end like this and inside go ahead
6:11:57
and add a div with a class name of margin bottom two like this and
6:12:03
inside you're going to render a server section which is a self-closing tag right now server section doesn't exist
6:12:10
so that is going to throw an error so let's go ahead inside of our components
6:12:16
a server and create a new file a server-section DOT DSX like this go
6:12:22
ahead and Mark this as use client like this and let's export const the server
6:12:27
section and just return a div saying server section like this and go back to your
6:12:35
server sidebar and now you can import the server section from dot slash server
6:12:40
section so let's check that out so we have the header search and now we have the server section and no error should
6:12:46
appear now and you should have a small text saying server section in your server sidebar great so now let's go
6:12:53
ahead and let's add the props inside of This Server section so go back inside of this component and write interface
6:13:01
server section props label is going to be a string roll is going to be an
6:13:07
optional a member role make sure to import that from Prisma client like that
6:13:13
section type is going to be either channels or
6:13:18
members like that Channel type is going to be an optional
6:13:23
Channel type from at Prisma slash client again so member role and channel type
6:13:29
like that and the server is going to be optional with a type of server with members with
6:13:36
profiles from add slash types so I'm going to separate those two and there we
6:13:41
go so those are our types so now let's go ahead and let's extract all of those label role section type Channel type and
6:13:52
a server and let's map the props so server section
6:13:57
props like that great so now let's go back inside of our
6:14:03
server sidebar and let's assign all of those props here so key uh my apology is not key section
6:14:10
type is going to be channels like this uh Channel type is going to be Channel
6:14:17
type which we already have imported here dot text like this roll is going to be
6:14:23
our current role which we already defined in a constant in This Server sidebar and label is going to be text
6:14:31
channels like this great so just confirm that you have the
6:14:37
channel type imported from at Prisma client and make sure that you have this
6:14:45
constant role which looks to the server members and looks at your own and then extracts the role out of that and then
6:14:52
we pass that here and that is the current logged in user's role perfect so now let's go back inside of This Server
6:14:58
section and let's start developing so inside of the server section here go ahead and give this div a class name
6:15:07
or Flex items Dash the center justify Dash between mpy Dash 2 like that go
6:15:15
ahead and remove this div and create a paragraph which is going to render the label which now says text channels and
6:15:22
let's go ahead and give this paragraph a class name of text that's extra small
6:15:28
uppercase Font Are semi bold text Dash sync Dash 500 and on dark mode we are
6:15:35
going to use text sync-400 like that great so now let's go
6:15:41
ahead and let's conditionally render some actions for this uh Channel section
6:15:47
so if role is not member row dot guest
6:15:53
so if we are either a moderator or an admin and if section type
6:15:59
is equal the channels like that so I'm just going to zoom out so you can see it in one
6:16:04
line in that case go ahead and render the following we are going to render an
6:16:11
action tooltip from dot dot slash action tooltip so go ahead and import this
6:16:17
from add slash components action tooltip like this and inside sorry not yet but
6:16:23
let's go ahead and let's give this action tooltip a label of create channel and the side of top like this
6:16:32
and let's go ahead and let's create a native HTML button element here which is
6:16:37
going to hold our plus sign from Lucid react so make sure you import the plus sign from Lucid react and I'll just move
6:16:43
it to the top here and let's go ahead and give this plus sign a class name of h-4 and W-4 and let's go ahead and give
6:16:52
this button a class name of text sync Dash
6:16:58
500 hover text sync Dash 600 dark mode
6:17:03
is going to use text sync-400 dark is going to also sorry
6:17:10
dark hover it's going to be tax Dash sync Dash 300M transition like this
6:17:16
great and now let's go ahead and take a look at how that looks now so if you are
6:17:23
not an admin you will not be able to see this plus button so make sure that you run admin or a moderator in this server
6:17:30
and now you can see that we have the text channels and I can use a shortcut to create a channel from here and we can
6:17:35
actually already add a model uh to trigger that so let's go ahead to the top of this server section and let's use
6:17:43
our good old on open from use model from add slash
6:17:49
hooks use model store like this so make sure you import this and now what you
6:17:55
can do is use this button to add an on click here like that
6:18:00
and call on open and we're gonna call the create channel like this so you can see that now once
6:18:07
you click on this plus icon I create channel option appears beautiful great
6:18:13
now let's go ahead and let's add some alternative options because this server
6:18:18
section is also going to be used to load a list of our members and we're not
6:18:24
going to have a plus icon to add new members instead we're going to have a cog or a settings icon which is going to
6:18:31
open the manage members Portal from the sidebar as well so go below this
6:18:36
conditional right here and create a new conditional saying if role is equal to
6:18:42
member rule dot admin so only admin can access this and if section type is equal
6:18:48
to members then go ahead and render the following again we're going to render an
6:18:53
action tooltip in fact maybe let's not write this all
6:18:58
over again let's just copy everything inside of this conditional and paste it like here
6:19:04
there we go so like that and let's go ahead and let's just change
6:19:11
a couple of steps so instead of this being a plus this is going to be settings like this from Lucid react so
6:19:18
make sure you import that like this and instead of on open create channel this
6:19:23
one is going to open members and a data server which we have from our prop
6:19:29
perfect so we cannot yet see this because we have not added uh that
6:19:35
specific uh member section yet but you're gonna see it very soon but that's it for our server section inside now
6:19:44
what we have to do is go back to our server sidebar where
6:19:49
we render the server section here and let's go ahead and iterate over our text channels and map them so text
6:19:58
channels.net individual Channel like this and let's go ahead and let's return a
6:20:06
server Channel like this and once you save you're going to get an error
6:20:11
because that does not exist so let's go and create that so I'm gonna go inside of my server again so this is inside of
6:20:19
the components folder and create a new file a server-channel.dsx like that let's mark
6:20:25
this as use client like this and let's write export const server Channel like
6:20:31
that and return a div same server Channel like this very simple let's go
6:20:38
back inside of our server sidebar and let's import this so server Channel like that from dot slash server channel so
6:20:45
the same way we did with Section search and header perfect let's go ahead and
6:20:50
let's create an interface for this before we add any props here so back in this newly created server Channel
6:20:56
component go ahead and create an interface server Channel props like that
6:21:01
it's going to chat uh the channel which is that channel from adprisma slash
6:21:07
client a server which is going to be a type of server because we're not going to be working with members or their
6:21:13
profiles and an optional roll of member role from ad Prisma slash client like
6:21:21
this great so now let's go ahead and let's extract those here so Channel
6:21:26
server and the role and let's map them to the props server Channel props like
6:21:33
that and now let's go back inside of our server sidebar and let's uh give them
6:21:38
everything they need so first let's do the key which is going to be Channel dot ID and then let's do
6:21:46
channel to the channel like this roll to be roll and a server to be server like
6:21:53
this let's go back inside of the server Channel and let's actually do some
6:21:59
development here so first thing I want to do is create another icon map here so
6:22:04
const icon map is an object if the channel is channel
6:22:10
type dot oops Channel type from at Prisma slash client so let me show you
6:22:16
everything I have imported here channel channel type member roll and a server so
6:22:21
make sure you have the channel type so Channel type dot text in that case we're going to render the hash icon from
6:22:28
lucidreact so make sure you have this imported here and you can just go ahead and copy this
6:22:34
two more times if the channel is audio in that case whoops audio in that case go ahead and
6:22:41
add the mic icon from lucidreact and if it's video go ahead and add the video
6:22:46
icon from Lucid react so hash mic and video like this great now that we have
6:22:52
that let's go ahead and let's add const params to be used for Rams from
6:22:59
next navigation and cons router to be used router from whoops from next
6:23:05
navigation as well so make sure you have used params and use router from next slash navigation
6:23:11
great now let's go ahead and let's create a dynamic icon using this map
6:23:17
here so I'm going to write const capital I so I can with a capital I like this because it's going to be rendered as a
6:23:24
component it's going to be an icon map Open brackets Channel DOT type like this
6:23:29
great so now let's go ahead and let's replace this div right here with a
6:23:35
button like that let's go ahead and add on click to be an
6:23:41
empty Arrow function and let's write a class name which is going to be dynamic so import C and from s slash lib utils
6:23:48
make sure you have the CN here so I'm just going to separate those two there we go this is what I just imported great
6:23:55
and let's go inside and for the first default values let's add line Dash clamp
6:24:01
dash 1 font large semi bold backslash oops
6:24:08
my apologies so I went way ahead of myself okay so what we're going to do is write a group px-2 py-2 like this
6:24:16
rounded Dash MD Plex items Dash Center Gap Dash X-2 like
6:24:24
that W Dash full on Hover BG dash
6:24:29
sync-700 10 like that and on dark on Hover background is going to be sync
6:24:38
Dash 700-50 let's give it a transition class and let's give it a margin bottom of one
6:24:45
as well great so now we have that uh and I'm just gonna zoom out to see if we are
6:24:50
already seeing something uh it appears not yet okay inside of this button let's render the
6:24:56
icon so icon which we got from here like that and let's give this icon a class
6:25:02
name of flex Dash shrink Dash zero w-5 h-5 X sync 500 and dark
6:25:14
text Dash sync Dash 400 like that and let me just expand to see if we are
6:25:19
seeing anything and there we go you can see that we are starting to see our first the text Channel inside of here so
6:25:25
right now the only thing we have rendered is this icon but slowly uh more stuff is going to appear here okay so we
6:25:33
have this icon right here now let's go ahead uh below the icon
6:25:38
and add a paragraph like this which is going to render Channel dot
6:25:44
name so now let's go ahead and give this paragraph a class name so class name is
6:25:50
going to be dynamic again so CN let's give it the default classes of line Dash clamp dash one
6:25:57
semi bold next extra small text Dash sync 500 group Dash hover
6:26:06
backslash sync-600 like this dark text
6:26:12
Dash sync-400 but dark group
6:26:17
hover whoops group Dash hover is going to be text sync
6:26:24
300 and transition like this so we have a
6:26:29
lot of classes more than usual that's because we are working with handling both the light mode and the dark mode at
6:26:35
the same time okay and now let's create the second which is going to be the dynamic class here which we forgot to do
6:26:43
in this button so we'll get back to that so add a comma at the end of this initial class in the CN for this
6:26:49
paragraph here and let's write if params question mark dot Channel ID is
6:26:56
equal to the current Channel dot ID in that case render the class text Dash
6:27:02
primary on dark mode render text sync-200
6:27:09
200 like that on dark mode group Dash hover is going
6:27:16
to be text Dash white like this so let's go ahead and let's see this now
6:27:21
so there we go you can see how our channel is looking now great and let's just go ahead let's go back to
6:27:28
this button element and after the end of this first initial class inside the CN Library here I have a comma and let's
6:27:35
write if grams question mark Channel ID is equal to channel dot ID in
6:27:42
that case add a class name BG Dodge sync Dash 700-20 and on Dart that's going to
6:27:49
be BG Dash sync Dash 700 like that great so let me zoom out a bit so you can
6:27:56
perhaps see this a bit clearer like this great so we have a lot of classes that's
6:28:01
because for every hover color we are also doing the equivalent in dark mode right so we are having a fully
6:28:08
customized light and dark mode that's where we have so many classes I know it's a bit hard to follow but you can
6:28:13
always just visit my GitHub and copy it uh if you're having trouble with it even I am getting confused in all of these
6:28:20
classes as you saw in the beginning when I started this component great so what
6:28:25
we're going to do now is we're gonna enable some additional actions when we
6:28:30
hover on this General class name right uh because we're going to be able to delete the channel or edit the channel
6:28:37
or if it's General in this case we're not going to be able to do anything with it so we're going to display a little
6:28:42
lock icon here so let's see how we're going to do that now so go ahead and find the end of this
6:28:48
paragraph right here I'm going to zoom in back so find the end of the paragraph and write if Channel dot name is not
6:28:56
General like that and if a role whoops I went out of this conditional and
6:29:04
if role is not equal to member role which we have imported dot guest so if
6:29:10
this channel is not a general Channel and if the current role of this logged
6:29:16
in user is either a moderator or an admin or in other words not a guest only
6:29:23
then are we going to render a div with the class name of ml-auto blacks
6:29:30
items Center and GAP x dash 2 like this and let's add the action tooltip which
6:29:37
we can import from dot dot slash action tooltip so like this and I'm just going to replace that with ADD slash
6:29:43
components like that and let's go ahead and let's give this
6:29:48
action tooltip a label of edit like this and inside of the action tooltip let's
6:29:55
add the edit icon from Lucid react so make sure you have edit hash mic and
6:30:02
video from Lucid react great and let's go ahead and let's just style this so
6:30:07
I'm gonna go ahead and give this one a class name
6:30:13
of hidden but on group hover is going to be visible or block
6:30:21
W-4 h-4 text Dash sync 500 on a hover
6:30:26
next sync-600 like this in dark mode the
6:30:32
default text is going to be text sync-400 but in dark mode on Hover
6:30:39
it's going to be a text Dash sync Dash 300 and transition like this great and
6:30:49
you can go ahead and copy this entire action tooltip here
6:30:54
and paste it below and replace the edit icon with the trash icon like this from
6:31:00
Lucid reacts so make sure you have the trash icon here and now if you try you're gonna notice that nothing
6:31:06
actually appears here so let's create a new channel here called new channel leave it at the text make sure it's a
6:31:13
channel type text because we are only rendering the text channels now and there we go now you can see we have the
6:31:19
edit and the delete options right here and let's see if this looks right in light mode there we go we have both of
6:31:26
those here perfect great so now let's go ahead and let's
6:31:32
add a little lock icon to the general channel right here to indicate that this
6:31:37
channel cannot be modified in any way so find the end of this conditional rendering right here
6:31:44
and after that go ahead and write if Channel dot name is equal to General in
6:31:50
that case let's go ahead and render a lock icon from Lucid react like this
6:31:56
and let's give you the class name of margin left Auto W-4 h-4 text sync 500
6:32:04
and on dark mode text sync Dash 400 like that and just make sure you have the
6:32:10
lock imported from Lucid react so now you should see that our general has a lock button but our new channel has an
6:32:17
edit and delete option right here great so we're gonna go back here to actually
6:32:22
enable these models to edit and delete but for now let's just wrap up the
6:32:28
entire sidebar here great so we successfully finished the
6:32:33
server channel uh what we have to do is of course uh add this on click and
6:32:39
enable the edit and the trash buttons here but let's uh go ahead and let's go back
6:32:45
inside of our server sidebar now and the same way we did with text
6:32:50
channels so we added a conditional for the length of the text channels array we rendered the server section which says
6:32:57
okay these are text channels and then we iterated over them we're going to do the same thing so we can copy this entire
6:33:03
thing so starting with the text Channel's length including the server section and the mapping and paste it
6:33:09
just below there like this so now if you take a look we're gonna have two sections of text channels here but what
6:33:17
we are going to change is that this one the second one is not going to be text channels is going to be audio channels
6:33:24
like that and we're also going to render audio channels dot map here so let's go
6:33:30
ahead and replace the label with voice channels because remember towards the user we are calling them voice channels
6:33:37
only internally we are calling them audio channels and change the channel type to audio like this great so let's
6:33:45
go ahead now let's see how that looks there we go look at I already have a voice channel so if you don't just go
6:33:51
ahead click create a channel and create a new one so new audio like this
6:33:58
and it's going to appear here any second there we go new audio perfect now let's wrap it up by also copying this entire
6:34:05
thing one more time and creating the video channels so let's go ahead and
6:34:10
paste it here do the video channels thing right here and the video channels.map let's call this video
6:34:18
channels and channel type is video like that perfect let's go ahead and there we
6:34:25
go I already have one so you can test one more time if you don't so new video like that
6:34:31
type is video and click create and there we go you now have a new video channel
6:34:37
here perfect what's left to render in this sidebar are all the members available here so we want to render this
6:34:44
list right here uh not including ourselves right so we don't want to render ourselves because in here uh we
6:34:51
are going to render members which we uh with whom we can talk to right so when we click on them we're gonna open a
6:34:57
conversation between one-on-one uh for that exact member and US perfect so
6:35:03
let's go ahead and let's you can copy this one more time the video channels right here and
6:35:11
paste it and change this to be members.length change this server
6:35:16
section to be section type members that means that you don't need the
6:35:22
channel type like that and change the label to members like this
6:35:28
like that and go ahead and pass in the server option which is optional so
6:35:33
server like this so we are going to need them from members but we are not going to need them for channels make sure so
6:35:41
you can see in this server section where we have channels we are not passing the server because we don't need them so we
6:35:46
need the server in the server Channel but not in the server section for Section type channels but when it comes
6:35:52
to members we do need that server you're going to see why in a second great so instead of rendering uh This
6:36:00
Server sorry this video channels we are going to render members and instead of calling this channel
6:36:06
we're gonna call it an individual member and inside we are no longer going to
6:36:12
render just a server Channel we're going to render a server member like this so go
6:36:19
ahead and save that file and let's go ahead now and let's just go inside of
6:36:26
server and create a new file a server Dash member dot TSX like this and let's
6:36:32
go ahead and Mark this as use client and let's export const
6:36:39
server member like that and return they did the same server member like
6:36:46
this go back to server sidebar and as always just import the server member from dot slash server member like this
6:36:54
and you should no longer be getting any errors great so one more thing that I want to do
6:37:00
before we begin this is just add a bit of more padding to this individual
6:37:05
sections because it kind of look looks cluttered so let's see how we can do that so I'm gonna go ahead and find
6:37:13
where I'm just going to zoom in so I can see a bit better okay so around each of
6:37:18
this mapping I want to add a specific div so let's see how I can do that what
6:37:24
I'm going to do I'm going to create a div around this text channels.map
6:37:30
like this so I'm just going to map that there we go so now it's wrapped in a div and I'm going to give this Dave a class
6:37:36
name of space Dash Y dash 2 pixels like that great and I'm going
6:37:43
to copy and paste this and do the same thing for the audio channels here and don't forget to end the div like that
6:37:51
I'm gonna copy it one more time and I'm gonna go to the audio sorry to the video channels around the map
6:37:58
and close it here indent this thing and one last time for the members I forgot we also have them so around this map
6:38:06
like this render it here there we go so let's take a look if that
6:38:11
improved and I feel like now it has a bit of a more space between them yes they don't look as cluttered great so
6:38:19
now let's go ahead uh and yeah you can see that now since we added the section type of members here we have a create
6:38:26
channel it still says create channel oh so we found the mistake great so this should say manage members right so let's
6:38:33
fix that very quickly let's go back inside of our server section so it's this component right
6:38:38
here so because we said the section type is members inside see if section type is members and if we
6:38:46
are an admin of This Server we are showing the settings button and we are opening the members model passing in the
6:38:52
server so let's change this label to be manage members like this so let's see
6:38:58
how that looks now there we go now I can easily create a channel wherever I want and I can also
6:39:05
easily manage members without going all the way to here perfect so let's finish up this server member component let's go
6:39:13
inside of the server member component and first thing I want to do is create an interface so let's go ahead I'm I
6:39:19
will Zoom back in and write interface server member props remember it's going
6:39:25
to be a type of member from Prisma client which is also going to have a profile which is a type of profile from
6:39:32
Prisma slash client like that and a server is going to be a type of a server from ad Prisma slash client so member
6:39:40
profile and the server right here let's go ahead and let's extract distract those two so member and a server and
6:39:49
assign the props here so server number props like this great now let's go ahead
6:39:56
and let's go back to our server sidebar here here and let's give them the
6:40:02
appropriate props inside so first thing I'm going to do is give it a key of member dot ID I'm going to pass in the
6:40:09
member member and a server server like this great so let's go back to server
6:40:16
member now and first thing first I want to create a role icon map here so const
6:40:21
role icon map is going to be an object which is going to use the member row so
6:40:28
import member roll from a Prisma client like I did right here so if member role
6:40:34
is guest there's going to be no icon next to its name if member role is moderator in that
6:40:43
case it's going to be a shield check from Lucid react so make sure you have that imported and it's going to have a
6:40:50
class name of h-4 W-4 margin left-2 and
6:40:55
tax Dash Indigo Dash 500 like that so I'm just going to zoom in a bit so you can see that in one line copy and paste
6:41:02
it and don't forget to add a comma change the last member role to the admin instead of Shield check is going to be
6:41:08
Shield alert like this and change the text Indigo to text rows like this there
6:41:14
we go perfect so we have our role icon map ready and now let's go ahead and
6:41:21
let's just add console Rams to be used for Rams from next slash navigation
6:41:26
const router is equal to use router from next slash navigation so we're just preparing this because we're gonna need
6:41:33
it later all right let's get this individual icon but since this is
6:41:39
already a component we don't have to name it in a capitalized way we can just do const icon is equal to roll icon map
6:41:46
member dot roll like this right in our server section let's take a look at our
6:41:53
service action just so I can explain the difference quickly you can see is it server section no it is server Channel I
6:41:59
suppose yeah so you can see that inside I had to put a capital icon that's
6:42:04
because I am just working uh with a type of lucid icon but in my server member
6:42:11
you can see that I'm not working with that I'm working with the react component so I can just name it like
6:42:17
this and then I can easily just render it as an icon you can see the difference
6:42:22
I can just render this and this is going to work but in my server Channel I cannot do that with this instead I'm
6:42:29
rendering it as a different element like this so I could have done that here as well but looks like I got ahead of
6:42:36
myself and already wrote it in this way so if you want to you can refactor it but you know as long as it works let's
6:42:43
go back inside of the server member now so I just briefly explained why this is happening
6:42:48
and we actually don't have to render this icon right now let's instead replace this div with a button like this
6:42:54
uh and let's go ahead and yeah we can already render the icon inside and let's go ahead and let's give
6:43:02
this button a class name which is going to be dynamic so import CN from s slash lib cm
6:43:11
sorry lib Dash utils my apologies all right let's go back to the class name here
6:43:17
and let's go ahead and write group ex-2 py-2 rounded Dash MD Flex items
6:43:25
Dash Center gak Dash X-2 W Dash full hover BG Dash sync Dash 700 10 on dark
6:43:37
on Hover BG is going to be sync 700 50 a
6:43:44
transition class and margin bottom of one like that and let's add a comma and
6:43:50
a dynamic class Rams question mark dot member ID is equal to member.id in that case we
6:43:58
are going to render vg-sync-700-20 and in dark mode is going
6:44:04
to be vg-sync-700 like this so let me zoom out just a bit so you can see how this is
6:44:10
supposed to look like so I have this class name this are all the default classes and then I added a little comma
6:44:16
here and added a dynamic class here great so let's go back inside
6:44:22
and let's go ahead and let's render the user Avatar which we created a couple of uh steps back
6:44:30
so import user avatar from dot dot slash user Avatar or slash components user
6:44:35
Avatar like this and let's go ahead and give this user Avatar a source of member
6:44:41
dot profile dot image URL and I am also going to give it a class
6:44:46
name because remember we added a class name prop to this component so we can modify it whenever we want and in this
6:44:52
case I want it to look a little bit smaller so I'm going to write class name h-8 and w-8 that is for small devices
6:45:00
but in medium we're gonna have h-8 and
6:45:06
w-8 like this great now let's go ahead and create a paragraph which is going to
6:45:11
remember render that profile name so member.profile dot name
6:45:17
and inside let's go ahead and give this paragraph a dynamic class name so class
6:45:22
name CN Point semi bold backslash SM backslash
6:45:30
sync Dash 500 like this group Dash hover text
6:45:36
sync 600 like that dark tag slash sync
6:45:42
400 dark group Dash hover text sync 300
6:45:48
and a transition like this and for the dynamic ones if Rams question mark dot
6:45:55
Channel ID is equal to channel whoops member dot ID like that
6:46:01
let's go ahead and add text Dash primary like this dark
6:46:07
x dash sync Dash 200 like this dark group Dash hover text Dash white like
6:46:15
this great so let's take a look at how this looks now
6:46:21
so just make sure that you have a member inside of your
6:46:26
member list right here if you don't just go ahead and invite yourself log out paste the link and just go back in here
6:46:33
and there we go you can see that now uh we have all of our channels here we have
6:46:39
all of our members here we can already open some stuff here perfect so one more
6:46:44
thing that I want to do before we go back inside of the server Channel and
6:46:50
server member so we add activate this models here it's just quickly modify
6:46:56
this create a channel buttons here so you can see that right now when I click on text channel the default Channel type
6:47:03
is text so that is completely fine but when I click on voice Channel it will be cool if it was selected to be audio by
6:47:10
default wouldn't it right and same for video channel it will be cool if it pre-selected video for me so let's go
6:47:17
ahead and quickly do that so let's go back uh inside of the use
6:47:23
model store make sure you save all these files going back inside of the use model store and let's extend our model data so
6:47:30
besides the possibility of accepting a server let's go ahead and write Channel
6:47:36
type question mark Channel type from Prisma clients so make sure you import
6:47:41
that like this great and no need to change anything else here and now let's
6:47:47
go ahead and let's go inside of components server inside of server section right here where we call let's
6:47:56
find this create channel option right here and pass in the data
6:48:01
Channel type like this and we already have the channel type in the props right here perfect and now that we pass in
6:48:09
that we can go back inside of our components models inside of the create
6:48:15
channel model right here and let's go ahead and let's fix this quickly
6:48:21
and just below this form let's add a use effect from react like this
6:48:29
like that and let's extract the channel type from the data now so in this use
6:48:35
model we can get the data and below this is model open let's extract the potential Channel type
6:48:44
from the data like this so there is a potential that we have a channel type and in this use effect let's go ahead
6:48:52
and write if there is a channel type in that case form dot set value type is
6:49:00
going to be Channel type like this
6:49:06
uh and let's go ahead and add an else here
6:49:11
form dot set value of type
6:49:16
Channel type dot text like this great and let's just pass in the channel
6:49:23
type here and the form and now let me just take a look at what this error is
6:49:30
so we can easily resolve that by going back into this const form use form and
6:49:36
just add Channel type pipe pipe Channel type dot text great so let's take a look
6:49:42
at now I'm going to refresh this and if I click on voice channel it's pre-selecting audio if I click on video
6:49:48
channels it's pre-selecting video and text channels by default is using the text option great so I just wanted to
6:49:55
modify that and now we can go ahead and create our edit and delete options as
6:50:00
well as our actual on click options so they redirect somewhere great great job so far
Edit Channels
6:50:07
so before we move on there are a couple of things that I want to fix uh before
6:50:12
we actually do this edit and delete models so first thing is that when I hover on the trash icon it says the edit
6:50:19
and it should say delete so let's go ahead and let's resolve that so I'm gonna go ahead and collapse everything
6:50:26
here I'm going inside of components inside of server and go ahead and pick
6:50:32
the server channel right here and go ahead and find these two action tooltips the edit one has the correct label but
6:50:39
the trash one should have the delete label like this so let's go ahead and
6:50:44
see that now there we go now it says delete great and what I notice is that
6:50:50
when I switch the light mode this sidebar seems to have the wrong color also this one seems to be a bit too dark
6:50:57
and you can see that this plus icon is almost not noticeable it doesn't have any border around it so let's go ahead
6:51:03
and let's quickly resolve that so I'm going to zoom out out just so I can see
6:51:08
my cyber at the same time and let's close everything and let's go inside of
6:51:14
components navigation navigation Dash sidebar right here all right and I feel
6:51:19
like we've made some mistakes here so first thing that I notice here is that I have a background for the dark color but
6:51:26
I don't have it for the regular light mode so after this dark BG color go
6:51:33
ahead and add regular BG which is going to be a hex code of e3 E5
6:51:41
E8 like this there we go so now after I save and there we go that already looks
6:51:48
a bit better let me zoom in yes so now this is clearly uh separated from this
6:51:54
one perfect and even this looks better now great so that's just one thing that
6:51:59
I wanted to do so every now and then make sure to switch to your light and dark mode just to you know make sure
6:52:06
that everything is still working fine perfect so now we can go ahead and create this edit and delete functions
6:52:12
here so let's go ahead and let's visit our use model store hook so I'm going to
6:52:19
close everything and go inside of the hooks use model store right here and after the lead server I'm going to go
6:52:26
ahead and add delete Channel like this so that's gonna be our new model and let's go ahead and let's
6:52:32
add a new option for the model data here which is going to be channel so it's an optional
6:52:38
type of Channel and you can import channel from at Prisma slash client so I
6:52:43
have channel channel type and server imported from Prisma client make sure you have those as well perfect now let
6:52:50
me close everything and let's go inside of components models and I'm going to copy and paste the delete server model
6:52:56
because it's the most similar one we can reuse so let's paste it here and I'm going to rename this copy to delete Dash
6:53:03
Channel Dash model like that go inside of that file make sure you are inside and rename this to delete channel model
6:53:12
like that and change this constant ease model open to delete channel
6:53:17
like this great now we can go back inside of the providers model provider
6:53:23
and go all the way down and add the delete channel model like this
6:53:29
and let's just fix this so add slash components like this there we go perfect
6:53:35
and now let's find a way to trigger that so we have to go inside of components inside of server and pick the server
6:53:42
channel right here and let's go ahead and let's add our const on open from use
6:53:49
model like right here so inside of the server Channel and I added an import of
6:53:55
use model from add slash hooks use model store right here and I destructured this
6:54:00
on open function perfect so now let's go ahead and let's find this trash icon and
6:54:05
go ahead and add on click to Be an Arrow function which calls the on open delete
6:54:11
channel like this and pass in the server and the channel like this there we go so
6:54:18
we already have both server and channel from our props right here so Channel and
6:54:23
server so that is safe to do and let's try that out now so in here I'm gonna go
6:54:29
and press delete and there we go we have a delete server prompt so let's modify
6:54:35
this delete server prompt to actually be the delete channel prompt perfect let's go inside of components models delete
6:54:42
channel model right here and alongside the server let's
6:54:47
immediately destructure the channel because we are going to need it here perfect uh and now let's go ahead and
6:54:54
let's change this from delete server to delete each Channel like this we can leave the are you sure you want to do
6:55:00
this but instead of rendering the server.name so let me just zoom out a bit so you can see inside of this a span
6:55:07
where we render the server.name instead we are going to render Channel dot name
6:55:12
like this and I want to add a little hashtag before that so it indicates that
6:55:17
it's a channel so are you sure you want to do this hashtag new channel will be permanently deleted so that looks good
6:55:24
enough for me and now let's go inside of this on click function right here
6:55:29
and before we do anything let's import our query string so import Qs from query
6:55:36
Dash string like this let's go back inside of the on click and let's go
6:55:43
ahead and let's write const URL to be qs.stringify URL the URL is going to be
6:55:52
backticks like this slash iepi slash channels slash Channel
6:55:59
question mark dot ID like that and the query is gonna hold the server ID from
6:56:06
Rams question mark dot server ID like this so let's go ahead and just add the param
6:56:13
so cons Rams is equal to use for Rams from next slash navigation
6:56:19
all right so now we have that and let's go ahead now and let's change
6:56:25
this to use this axis right here perfect and after we delete our Channel no need
6:56:33
to go all the way to slash instead we can go to slash servers
6:56:40
slash params Dot question mark dot server ID like this
6:56:45
perfect uh great so if I try this now I'm pretty
6:56:50
sure I'm going to get a 404 error here so let me try that there we go a404
6:56:56
error and now let's go ahead and let's create this route before we go there it actually seems to
6:57:02
me that we are passing actually the structuring this server for no reason at
6:57:08
all or the other thing we are using params instead of using that server so
6:57:14
let's actually change that so this should still work but I don't want to use params if we don't need to so let's
6:57:19
remove the params like this let's remove the use programs and instead of using params that server ID let's use this the
6:57:26
structured server from here so we're gonna write server question mark dot ID like this and same
6:57:33
thing here so server question mark.id so both would work because we are only able
6:57:38
to call these models or when we are inside of server ID parameters but still
6:57:44
let's follow some conventions let's be consistent all right and now let's go ahead and let's actually create that
6:57:51
route so I'm going to close everything I'm gonna go inside of the app folder inside of API we already have the
6:57:58
channels so let's create a new folder Channel ID like this and inside go ahead
6:58:04
and create route.ds like that perfect let's export asynchronous function
6:58:09
delete like that which is going to have a request and it's going to have params
6:58:16
which are going to be an object which store the channel ID which is a string
6:58:22
like this perfect let's open our try and catch block let's log the error inside of Channel
6:58:30
underscore ID delete error like that and let's return new
6:58:35
next response from next slash server internal error and pass in whoops the
6:58:42
status of 500 like that great so we've done this a couple of
6:58:48
times already perfect let's get the current profile so profile is equal to our weight
6:58:53
current profile and make sure you import that here
6:58:58
if there is no profile return new next response
6:59:04
unauthorized with a status of 401 like this great now let's also
6:59:11
get the search params from new URL request.url like that and
6:59:20
let's get the server ID from search params dot get server ID like this great so if
6:59:30
there is no server ID let's return new next response
6:59:35
server ID missing with a status of 400
6:59:40
like that and if there are no params dot Channel ID return new next response
6:59:48
Channel ID missing with a status of 400 like that perfect
6:59:56
and now let's actually delete the server so let's go ahead and let's import
7:00:02
DB from add slash libdb so like like this and now let's go ahead and write
7:00:09
cons the server is equal awaitdb.server.update like that and
7:00:15
inside let's go ahead and write where ID is server ID and members
7:00:21
sum profile ID is equal to current profile.id which we store in this
7:00:28
profile variable and a role of that member needs to be either a member role
7:00:35
import that from at Prisma slash client like I did right here and I'm just going to move it to the top
7:00:41
so it needs to be either an admin or member role dot moderator like this one
7:00:47
of the two perfect and then let's go ahead and add the data channels delete
7:00:54
we're gonna delete the channel by the ID of rams.channel ID and name not General
7:01:01
so we are never gonna enable a deletion of the general Channel even if we send that Channel's ID it's like a security
7:01:08
measure for us even though in the front end we disable it but remember what I said uh front-end validation can easily
7:01:15
be bypassed and you always need to do the same on the server so just write
7:01:20
return nextresponse.jsonserver as well perfect so if we try this I think it should
7:01:26
already work so let me refresh right here let's check out this test audio I'm
7:01:31
going to click delete confirm and let's see if that's going to work there we go
7:01:37
it's been deleted let's try with this text Channel if I delete it
7:01:42
there we go that's deleted let's try with new video if I delete that
7:01:47
that seems to be deleted as well Perfect all right and now let's do the edit
7:01:53
functionality here so in order to do the edit functionality we have to go back inside of our use
7:02:00
model store right here and after delete channel add edit
7:02:05
channel right here all right and we don't have to modify anything here
7:02:11
instead let's go inside of our components inside of our models and use
7:02:16
the edit server model sorry no not that uh go ahead and find the create channel
7:02:21
model so that's the one that is the most similar to ours because it has the select options and stuff and just change
7:02:27
it to edit Dash Channel Dash model like this make sure you are inside of that new
7:02:32
file and rename this to edit Channel model like this and change this type to
7:02:39
edit Channel like that perfect and now let's just go all the way to the bottom
7:02:44
and change this from create to save like that all right and now
7:02:50
let's go back inside of our components providers model provider and at the
7:02:55
bottom add edit Channel model like that from dot dot slash models edit Channel
7:03:02
model and you already know I'm gonna modify that to slash components perfect and now let's go ahead back inside of
7:03:09
components server server channel right here and add to this edit icon on click to be
7:03:17
a narrow function which calls the on open like that edit Channel and pass in the server
7:03:27
and this channel like this perfect so now if I try the edit that should work
7:03:34
as well I just refreshed clicked on edit and there we go we opened a create channel and we're going to modify it to
7:03:40
match the functionality of edit Channel so let's go back inside of the edit
7:03:46
Channel component inside of components models edit Channel model right here and
7:03:52
change the title from a create channel to edit Channel like this perfect and
7:03:59
now let's go ahead and find this use effect right here
7:04:04
and we're not going to need this inside so you can remove this you can leave the form inside and just write if
7:04:12
there is a channel and we don't have that so let's just do that quickly so I'm going to remove this
7:04:17
just so we don't get confused so go back here to use model we have data go ahead
7:04:23
and extract the channel and the server like this and actually we are not gonna have the
7:04:30
channel the type for this one so you can remove that as well like that
7:04:35
and you can just remove this to be like that okay so just Channel and server
7:04:40
from the data and the default values are they so a bit different than the create channel one all right now inside go
7:04:46
check go ahead and check if there is a channel form dot set value name is going to be
7:04:53
Channel Channel dot name
7:04:59
and form dot set value of type is going to be Channel DOT type like this great
7:05:05
uh and let's just see let's also add the channel here so Channel like that and I
7:05:13
think we can resolve this um let me just explore a bit so what we can do to resolve this is
7:05:20
remove it from the default values because we are going to fit it either way but that seems to not work instead
7:05:27
let's try Channel DOT type pipe pipe like this and
7:05:32
add a question mark here there we go that seems to have resolved it okay so type can be either the initial Channel
7:05:39
DOT type or Channel type dot next uh great so you might be wondering why am I
7:05:45
even doing a use effect why don't I just do Channel type channel.name here well
7:05:50
the problem is that this model is rendered before we receive this channel
7:05:56
data right here so it's not it needs to be retriggered in the use effect because
7:06:01
this doesn't change dynamically all right so now I'm going to save this
7:06:07
and let's go ahead and let's try so I will refresh this let me zoom out a bit
7:06:12
if I click on edit new audio there we go Channel type is new audio and channel type is audio if I click on video it
7:06:20
says test video channel type video so it seems to work let's just create a new text Channel
7:06:27
just to test if it also works for that so we have the new text Channel I'm going to click edit I have the correct
7:06:34
name and the correct type perfect and what we have to do now is we have to modify the on submit function uh right
7:06:41
here so the on submit function is gonna is gonna actually be a bit different so
7:06:47
find on submit Qs stringify URL and add backticks slash API slash channels slash
7:06:53
Channel question mark dot ID and in the query uh instead of using params we are
7:07:00
no longer gonna we're no longer going to be using params here so you can remove that and remove the
7:07:05
import for use params instead of using that we're going to use the server from our data dot ID so we
7:07:14
have this server restructured from the data because we are passing in from the server Channel component
7:07:19
um perfect and I think that should be it uh now of course if I try we're going to
7:07:25
get a 404 error so let's say edited
7:07:30
Channel like this I click save there we go uh actually it's 405 because we have
7:07:35
that route just and we don't allow this method okay so now let's go ahead back
7:07:40
inside of our uh Channel ID so I'm gonna close everything make sure you save those files go inside of the app folder
7:07:47
API channels Channel ID route TS so we already created this delete function and
7:07:54
let's just copy and paste the entire thing so I'm going to copy that and just below paste it and let's rename this
7:08:01
from delete to patch like this great so it has the same params and alongside
7:08:08
search params let's also add a name and type from await request.json like this
7:08:16
because we also need that perfect and alongside checking for profile server ID
7:08:21
and params.channel ID let's also check if name is General so if somehow they
7:08:27
bypass the front-end validation let's give them a return new next response
7:08:32
name cannot be as single back takes single ticks in general like that with a
7:08:38
status of 400 like this perfect so let me just expand this a bit okay
7:08:45
and now let's go ahead uh and in This Server what we are going to do is not
7:08:51
delete it but we are going to modify it so this is correct the work query can stay the same and now let's go ahead and
7:08:59
modify this data a bit so I'm going to delete everything and write it again so it's easier so channels
7:09:04
update where ID is params.channel ID not
7:09:11
name General like that so we cannot update the general and let's go ahead and add the data name
7:09:20
and type like this there we go and let's change this to channel ID patch like
7:09:27
this great all right that seems to be okay uh it's since I've triggered a
7:09:32
error here so let's see what that is about maybe you have that as well let's take a look at my terminal right here
7:09:39
okay so I'm just going to restart my application npm run Dev let's see if the
7:09:44
error is still being triggered or if that was a one-time thing during my
7:09:49
development it seems to be a one-time thing during my development okay
7:09:55
and now let's go ahead and try this so I have this new audio Channel and let's see if I can rename it to edited audio
7:10:02
so I'm going to click save okay it seems like there was an error
7:10:07
let's go ahead and check it out so it still says the same thing
7:10:13
interesting okay we have a patch function here correct yes we do a patch
7:10:20
function okay so it should work let's see why it doesn't I think it's because we left a post function inside of our
7:10:26
model so go inside the components model edit Channel model right here
7:10:32
let's go inside of the on submit and yes it is because we are doing axios.post
7:10:38
when we should be doing axios.batch like this so let's try this one more time
7:10:44
let's change this to edited Dash audio and let's click save and now it seems to
7:10:50
be working and there we go this has changed to edited audio let's try with the text Channel let's try General it's
7:10:58
not allowing us let's say edited text Channel and click save and now it's turned into edited text
7:11:05
Channel perfect let's see if I can do this new text and I'm going to change
7:11:11
the type to text and save this let's see if that's gonna work there we go it's up with the text channels perfect so we
7:11:18
have the working uh Delete we have the working edit everything seems to be
7:11:24
working exactly as we expect we can also change this uh moderations from that
7:11:31
shortcut that we added this little icon right here perfect
7:11:36
and everything's here seems to be matching as well perfect so we are finally ready to start creating our chat
7:11:44
uh headers and chat messages and chat inputs and slowly and also of course
7:11:50
video chats right so we are ready to do that now great great job so far
Channel ID Page
7:11:56
so now let's go ahead and let's actually create this actions when we click on channels and members that we actually
7:12:03
get redirected not to the server ID page but either the channel page or the
7:12:08
conversation page so let's go ahead and let's revisit our server Channel first
7:12:14
so go inside of components server server channel right here and what we're gonna
7:12:21
do is we're gonna add an on click function so const on click
7:12:27
like this and go ahead and just write router which we have right here make
7:12:32
sure you have use router from next navigation inside of the server Channel component
7:12:38
router.gush open backdicks slash servers slash params question mark dot server ID
7:12:45
slash channels slash open object Channel dot ID like this and then we have to add
7:12:54
that on click to this empty Arrow function in the button perfect so if you
7:13:01
go ahead and try now and click on any channel you're gonna get redirected to a 404 page perfect well not perfect but
7:13:08
we're gonna fix it one thing I want to bring your attention to is that if I try and edit
7:13:14
a model opens and then I get redirected that's because this Global button on
7:13:19
click right here right let me just expand my screen is overriding this clicks inside on the
7:13:28
edit and the trash so let's go ahead and let's do this now I'm gonna go ahead and
7:13:33
write const on action and we're gonna accept event which is
7:13:39
react.mouse event and then action which is a model type
7:13:45
and you can import that from add slash hooks model store so if you cannot import it make sure that you have the
7:13:52
export in front of type model type like that so just import the model type
7:13:57
alongside the use model from add slash hooks use model store and confirm that you have the export in front of type
7:14:03
model type so now we get access to all of this here let's go back to our own action here
7:14:09
and let's go ahead and write event.stop propagation like that and then on open
7:14:15
Action so we know which model to open dynamically and let's pass in the channel and the server as the data and
7:14:23
now let's use this on action instead of using this right here so instead of
7:14:30
calling on open here in the edit go ahead and just call
7:14:36
on action and passing the edit Channel like this
7:14:42
let's see if that's correct what did I just write oh an event as well my apologies so an event passing an event a
7:14:49
comma edit Channel like that and same thing here get the event from the arrow function and replace this with on action
7:14:56
pass in the event and what is this one this one is the lead Channel like this
7:15:02
great so let's try that now and now I should not get over uh right so if I
7:15:08
click on edit there we go no redirect if I click on delete no redirect but if I
7:15:13
specifically click on a channel I get a 404 so that's exactly uh what I wanted
7:15:18
to do here and I think I noticed one slight mistake here
7:15:24
and that is inside of our components server server member right here if I
7:15:30
remember correctly so in the button I'm comparing params.member ID to be equal to member.id but right here I'm using
7:15:38
params.channel ID to check for member ID so let's just change that so above the
7:15:44
user Avatar in this paragraph which renders the member profile name change the dynamic class to look for member ID
7:15:51
instead of the channel ID so you won't be able to see any differences yet that's because we have not created any
7:15:58
of these classes so all of them lead to 404. and now let's go ahead and let's
7:16:04
add the own click uh inside of This Server member because right now I can click as much as I want and nothing
7:16:10
happens so we are inside of that server member right here and let's go ahead and
7:16:17
let's add and on click function so cost on click is an arrow function which
7:16:22
calls the router.push so make sure you have the router and use router from next navigation and it calls
7:16:30
the router.push slash servers slash
7:16:35
rams.server ID add a question mark here slash conversations slash member dot ID
7:16:43
like that perfect and let's go ahead and end this on click on this button here
7:16:50
like that perfect so now if I try and click on members I get to a 404 page so
7:16:56
we did a very simple on click function and added it to the button that holds our user Avatar and the name of the
7:17:02
member perfect so we can now go ahead and actually create a very simple page
7:17:08
just like we have with this server ID page and instead it's going to render the channel ID page or the conversation
7:17:15
ID page so let's go inside of our main folder so
7:17:22
I'm going to close everything just remember to save your files go inside the app folder main routes and we have
7:17:29
the servers server ID here so let's go ahead inside and create a new folder
7:17:35
called channels like that and inside create another folder in square brackets
7:17:42
Channel ID like that and inside create a new file page.dsx like this so main routes server
7:17:50
server ID channels individual Channel ID and let's just go ahead and add Channel
7:17:57
ID page like that and I did Channel ID page like this perfect so now if you go
7:18:05
ahead and try and click on General you should no longer get a 404 instead the general should be selected like this and
7:18:13
in the URL you should see the slash channels and the ID and you should see the channel ID page and same thing for
7:18:20
this other channels right here perfect so let's go ahead and do the same thing
7:18:26
for the conversations now aka the members so I'm gonna collapse everything go
7:18:32
inside of app main routes inside the server ID create a new conversation a
7:18:38
new folder called conversation like that and inside create a new folder called in
7:18:44
square brackets member ID like this and inside a new page.dsx which is just
7:18:51
going to be member ID page with a div member ID page like this great and now
7:18:59
if you click on this one all right we are still getting a 404 and I think I
7:19:06
know why yes I named this folder conversation when it should be conversations multiple of them great and
7:19:15
now I think it should automatically there we go so you can see how it looks now you can see how it's that selected
7:19:21
very nice perfect let's go ahead and switch to light mode to see if this is still okay and it seems to be looking
7:19:28
good great so I'm gonna continue in dark mode to save my eyes one more thing that
7:19:33
I want to do now is that I'm going to remove my URL let me just click here there we go so you
7:19:40
can just click on your server I don't want this state to exist so I always want user to immediately be redirected
7:19:48
to the first channel we can find which in our case is always going to be the
7:19:53
general Channel because we don't allow anyone to delete this General channel so whenever I refresh on this server ID or
7:20:01
just click on this I want to be immediately put into a general channel so let's go ahead and do that now
7:20:10
so let's go inside well let me close everything let's go inside of our app
7:20:15
folder inside of main routes inside of server ID and find the page that ESX
7:20:23
that currently just says server ID page and inside of here let's go ahead and
7:20:28
let's turn this into a asynchronous function and let's go ahead and give it an interface of server ID page
7:20:37
props and it's going to accept Rams of server ID which is a string like this
7:20:43
and let's go ahead and let's extract those params here and let's add them to
7:20:49
the prop server ID page props like this great now let's go ahead and let's fetch
7:20:54
the current profile so const profile is equal to await current profile
7:21:00
from s slash lib current profile like that of course make sure you don't
7:21:05
accidentally have used client at the top so this is a server component uh if
7:21:10
there is no profile we can redirect return a redirect
7:21:18
to sign in from clerk like this so make sure you import redirect to sign in from
7:21:24
a clerk like that and I'm just going to separate these two inputs so that's if we don't have a profile all right and
7:21:31
now let's go ahead and let's attempt to find this server so con server is equal await DB which you can import from s
7:21:39
slash libdb like I did right here db.server dot find unique like this
7:21:46
where ID is rams.server ID members
7:21:51
some have a profile ID of the current profile.id so we are confirming that we
7:21:57
are a member of this profile and let's go ahead and add include
7:22:02
channels where and let's find the general Channel using the name General like this
7:22:11
so this is why we don't allow users to rename this Channel or delete it because we need it to redirect the user and
7:22:18
let's order created at ascending like this great and
7:22:25
now let's go ahead and write const initial channel to be server question mark dot channels and pick the
7:22:32
first one like this and if initial Channel question mark.name is
7:22:40
not General so make sure you don't misspell General here
7:22:45
in that case return null so this should technically never happen but just in
7:22:51
case we're just gonna display an empty page even though it should absolutely never happen and instead of this return
7:22:57
return I redirect from next slash navigation so make sure you import redirect from next slash navigation like
7:23:04
that and return a redirect slash servers slash rams.server ID
7:23:12
slash channels and slash initial Channel question mark dot ID and let me just
7:23:19
expand this so you can see it in one line and maybe zoom out there we go so we find the initial Channel we check if
7:23:27
the initial channel name is General if it is we go ahead and redirect the user to server ID slash channels slash that
7:23:34
initial channel that ID and there we go you can see that now no matter how many times I refresh or if I click on this
7:23:42
right here oh baby it's not working let me try and refresh again
7:23:47
okay it seems to not be working uh let's go ahead and explore why
7:23:53
so I'm not exactly sure because this server ID page I don't think this even exists in the code so this could be some
7:24:00
cash or maybe I didn't save this file maybe it's that okay it was that I
7:24:05
didn't save my file okay so now you can see that if I try and click on my server you can look at my URL how it's
7:24:12
immediately redirecting to the initial Channel and yeah I can go ahead and remove the slash channels and just leave
7:24:19
the server ID and you will see that I'm immediately redirected back to the general Channel perfect so this is
7:24:25
exactly what I wanted to do exactly that perfect and now we can go ahead and
7:24:32
finally start developing the header for our chat the body for our chat the input
7:24:38
for our chat the messages the videos the audios everything else great great job
7:24:44
so far so let's go ahead and let's create our chat header component which is going to
Chat Header
7:24:50
be displayed right here at the top so in order to do that the first thing we have to do is we have to go inside of our
7:24:58
Channel ID page so I'm going to close everything just so we repeat our knowledge of our folder structure so
7:25:04
we're going to go inside of the app folder main folder routes server server
7:25:09
ID and our newly created channels folder which holds the individual Channel ID
7:25:14
right here and choose that page.psx so what we have to do in here is we have to
7:25:20
load the current Channel using the ID which we have and we have to load the current member so let's go ahead and
7:25:27
let's turn this into a asynchronous function like this and let's go ahead and let's create the props for this
7:25:34
channel ID page so interface Channel ID page props like that it's gonna have
7:25:40
Rams and inside of those params you are going to have a server ID which is a string and let me just zoom in a bit and
7:25:48
channel ID which is also a string so how do I know that we are going to have both
7:25:53
the server ID and the channel ID well because of the folder structure so we are inside of server ID and we are
7:25:59
inside of Channel ID which means both of those are going to be inside of our URL so as long as you've named them
7:26:05
correctly you're gonna have them inside of every server component inside of this
7:26:11
structure so now that we know that we have those let's go ahead and let's extract the params from the props and
7:26:18
let's just map them to channel ID page props so our typing is correct great and
7:26:24
now let's go ahead and let's fetch the current profile so const profile is equal to await current profile from add
7:26:31
slash lib current profile like I added at the top right here if we don't have a profile we can go
7:26:39
ahead and return redirect to sign in from clerk so just go ahead and write
7:26:45
this and make sure you have imported this from clerk next JS and as always I'm going to separate those two Imports
7:26:52
great now we can go ahead and import our database util so import
7:26:59
DB from add slash lib DB like this and let's go ahead and let's fetch our
7:27:05
Channel using the ID so cons channel is equal to 08db.channel dot find unique like this
7:27:12
and let's go ahead and write where ID is equal to params.channel ID like this great and
7:27:21
now let's write const member is equal to await DB dot members whoops.member dot
7:27:27
find first like this where server ID is equal to params.server ID
7:27:35
and profile ID is equal to profile dot ID like this perfect so we fetch the
7:27:42
channel which holds this ID and we found a member using a server ID and its
7:27:49
respective profile ID so there can be many members with this profile ID but
7:27:54
the member we want to find is one that is inside of this server and holds this
7:28:00
profile ID because remember a profile can have as many members as it wants so
7:28:06
whenever we join a new server we become a new member of that server but that is still the same profile ID so to identify
7:28:13
the one member we want to find we also have to specify the server ID so that's why we're using find First and not find
7:28:19
unique because we have not specified in the schema that these two Fields need to be unique perhaps we should have done
7:28:26
that but let's go ahead and let's continue developing with what we have great so let's go ahead and now write if
7:28:33
there is no Channel or if there is no member in that case we
7:28:40
can redirect from next slash navigation so make sure you import redirect from next slash
7:28:45
navigation and I'm gonna move it to the top and let's go ahead and redirect the user back to slash because they are trying to
7:28:52
access a channel that they don't have access to great and now that we have this let's go ahead and let's write a
7:28:59
class name here with BG Dash white on light mode and on dark mode we're gonna
7:29:05
have BG Dash open square brackets and a hashtag of 3133 8 like this
7:29:12
so three one three three three eight like that I added a one extra three if
7:29:18
you didn't notice but I removed it great and a flex Flex Dash coal and H dash
7:29:24
full like this great so let's see uh I I'm not even sure if the color has
7:29:30
slightly changed or not but uh anyway this is how I want it to look like now
7:29:35
inside of here let's go ahead and let's remove this text and let's write chat header like this and once you save
7:29:42
you're going to get an error because chat header does not exist so let me
7:29:48
just refresh this page to make sure it's loading there we go so chat header is not defined make sure you have your app
7:29:54
running let's go ahead and let me close everything and let's go inside of components and create a new folder
7:30:01
called chat and inside here we're gonna hold all of our chat components so
7:30:06
create a new file chat boops chat header dot ESX like this let's go ahead and
7:30:13
let's import hash from Lucid react because we're gonna need that
7:30:19
and let's go ahead and let's just quickly fix the error so exporting const chat header like this and return a div
7:30:27
saying chat header like that let's go back inside of our page which is located
7:30:33
inside the app folder all the way to the channel ID page here and now we can safely import this from add slash
7:30:40
components chat chat header great and now if you save this file uh you should
7:30:46
not see an error anymore perfect now let's go ahead and let's create an interface for this so interface chat
7:30:53
header props are gonna have a server ID which is a string a name which is a
7:31:00
string a type which is going to be either a channel or a conversation because remember we
7:31:07
are going to reuse all of our chat components for both the channel view the video or audio Channel View and also for
7:31:16
direct one-on-one member conversation view so we have to adapt the props to
7:31:21
change the UI appropriately and an image URL which is going to be an optional string like this great so let's go ahead
7:31:29
and let's extract all of those here so server ID name type and image URL and
7:31:36
let's go ahead and map those to chat header props like this perfect
7:31:42
now let's go ahead and let's give this div a class name of textlash MD font
7:31:48
semi bold and let me just expand my screen so we can see as much as possible in one line so fonteness semi bold
7:31:55
px-3 blacks item slash Center h-12 border Dash neutral Dash 200 on
7:32:05
dark mode border Dash neutral Dash 800 and Border Dash B Dash 2 like that
7:32:13
perfect so let's go ahead and let's see how that looks now and there we go you can see
7:32:19
that we finally have this little chat header here that matches the height of
7:32:24
this uh drop down right here perfect and if you're wondering well when comes the
7:32:31
time that we actually enable the mobile view where this is where we're gonna hold that little toggle button so let's
7:32:37
go ahead and let's just add it here now so I'm gonna go ahead and write menu
7:32:43
from Lucid react right here so make sure you import the menu here
7:32:48
and there we go so that's how that is going to look like of course now it's not functional but later we're gonna
7:32:54
turn it into a component which is going to trigger uh a drawer which is going to
7:32:59
hold this navigation sidebar and This Server sidebar so that's how we are going to handle mobile but before we get
7:33:06
there let's go ahead and let's write a dynamic render here so type is equal to channel
7:33:15
in that case let's go ahead and return a hashtag like this and let's go ahead and give it
7:33:22
a class name of w-5 h-5 backslash sync Dash 500 dark mode is
7:33:32
going to have text Dash sync-400 and margin right off 2 like this and right
7:33:38
now we are not seeing anything that's because we have not passed any props to this chat header so let's go back inside
7:33:44
of our page which renders the chat header and let's just give it some props so I'm going to give it a name of
7:33:51
Channel dot name I'm gonna give it a server ID of
7:33:57
channel.server ID and I'm going to give it a type of Channel like this because we are using
7:34:03
this chat header for rendering our Channel and there we go you can see how a little hashtag has appeared right here
7:34:10
so let's go ahead and let's continue the development here uh after this hash
7:34:15
right here let's go ahead and let's add a paragraph which is going to render the name like
7:34:22
this and let's go ahead and give this a class name of ml Dash whoops a font Dash
7:34:29
semi bold text Dash MD and text Dash black and on dark mode tab slash white
7:34:35
like this there we go great so we are not entirely done with this chat header
7:34:42
but we're gonna continue the development of it uh when we enable our one-on-one
7:34:47
conversations so obviously it's okay that it says general for stuff like this for these channels you can see all of
7:34:55
this is correct when I click on new text it says new text in general it says General on edited audio it says edit
7:35:01
audio but when I click here we're going to modify this a little bit instead of showing a hashtag we're going to show
7:35:07
the actual user image and some other stuff but we're gonna come to that later what I actually want to do now is I want
7:35:15
to create the mobile toggle button so I'm going to turn this icon off menu
7:35:20
into an actual working toggle so in order to do that we have to add another
7:35:26
component from chat CN so let's go ahead to chat CN documentation and find the
7:35:32
component under s sheet right here there we go and let's go ahead and copy the
7:35:38
command it needs using npm like that I'm gonna go inside of my terminal here I
7:35:44
will shut down the application and I'm going to write npx chat cnui at latest add sheet like this great and just
7:35:52
confirm this installation like this and you can npm run Dev your
7:35:58
application again great now let's go ahead and let's go and close everything and go
7:36:05
inside of your components and create a new file called mobile Dash
7:36:11
toggle.tsx so outside of any folder except the components folder and let's
7:36:16
go ahead and let's write export const mobile toggle is going to be a simple function which
7:36:24
is going to return for now let's add that menu icon from Lucid react like
7:36:30
that so very simple and now we're gonna go back inside of our chat folder find the chat header and replace the menu
7:36:36
icon with mobile toggle like this from dot dot slash mobile toggle or in my
7:36:42
case I'm going to replace it with Slash components and separate the two and we can remove the import from menu from
7:36:48
here and right now everything should say exactly the same because that's the only thing we added in the mobile toggle so
7:36:55
now let's go ahead and let's import everything we need from our new sheet component so go ahead and import a sheet
7:37:02
import sheet content like that and Sheet trigger
7:37:08
like this from add slash components slash UI slash sheet like this
7:37:15
great and now let's go ahead and replace this with sheet like this inside a sheet
7:37:23
trigger which is going to have as child prop and inside we're gonna add a button from
7:37:30
dot slash UI button so make sure you add this import and I'm going to replace it with Slash components like this so it's
7:37:36
going to be a button which is going to render our menu icon and let's give this button a variant of ghost a size of Icon
7:37:45
and a class name of MD hidden so we only want this to show on mobile devices
7:37:51
perfect and below the shield trigger here add a sheet content like that
7:37:57
let's go ahead and give it some props so a side is going to be left last name is
7:38:02
going to be padding Dash 0 flex and gap-0 like this perfect so inside of
7:38:09
this content let's go ahead and create a div element with a class name of w Dash
7:38:15
open square brackets 72 pixels like that and inside you're going to render the
7:38:20
navigation sidebar from dot slash navigation navigation sidebar I'm just going to
7:38:27
replace that to add slash components like this so we get the navigation sidebar from the navigation folder and
7:38:35
we're also going to add a server sidebar from dot slash server server sidebar
7:38:40
like this and let's just replace these two components as well perfect so let me
7:38:46
just zoom out a bit so you can see it in one line so we got the navigation sidebar from add slash components
7:38:52
navigation slash navigation sidebar as it is inside of this folder the navigation sidebar and same thing with
7:38:58
the server sidebar inside of components server folder so server and we have the server sidebar right here and one thing
7:39:05
that is missing inside of here is the server ID which means we are also going to need this server ID from the mobile
7:39:11
toggle so let's go ahead and just quickly add the server ID here and let's map the prop state so server ID is a
7:39:19
type of string like this and then we can safely pass the server ID server ID here
7:39:26
as well perfect so now let's go back inside of our chat header component
7:39:31
where we render the mobile toggle and let's go ahead and pass in the server ID to be server ID like this there we go so
7:39:39
you can see now when I expand and let me just refresh the main sure all of this is up to date
7:39:46
let's just wait a second for this to load for me and there we go you can see that now when I have this active in
7:39:52
desktop view I don't have the mobile toggle but when I Collapse it it becomes active and if I click you can see that
7:39:59
the drawer opens amazing so exactly what we wanted and I can change the channels
7:40:04
from here like this I can trigger a model to create my own server create my
7:40:09
own channel perfect so exactly what we wanted to for mobile view and we don't
7:40:15
have to worry that this mobile toggle is all the way here in this chat header
7:40:22
because remember we do a redirect whenever a user joins a server we immediately join the general channel
7:40:28
here so they're always going to be if they're on mobile they're always going to see this button right here to trigger
7:40:35
this perfect so we have successfully wrapped up a big part of chat header and
7:40:41
now what we have to do is modify this chat header to match our one-on-one
7:40:47
conversation view so when I click on Antonio here I want it to show the same
7:40:52
chat header but a little bit modified so it's time for us to wrap up our
Prisma Schema completion
7:40:59
Prisma schema so let's go ahead and do that I'm gonna close everything and I'm gonna go inside of the Prisma folder
7:41:06
schema.prisma right here so so far we've added this server model the profile
7:41:11
model member and the channel model but we also have a couple of more models
7:41:16
missing from here so let's go ahead and let's create the model message like this
7:41:22
it's going to have an ID which is a string ID and a default value of uuid
7:41:28
like this it's going to have content which is a string of db.txt so we allow long messages
7:41:35
we're going to have an optional file a URL which is an optional string so we
7:41:40
add a question mark at the end with also a DB dot text because URLs can get pretty long let's create a connection
7:41:47
with the member ID who will send this message like this and write a member
7:41:53
member at relation like this Fields member ID
7:41:59
references ID and on delete is going to be Cascade like this let's see if I can
7:42:06
expand my screen a bit more and I seem to have made a typo here so let me zoom
7:42:11
out there we go like this and now we have to add this relation back to the
7:42:18
member so let's go ahead and find the member right here and after the server ID here
7:42:26
let's go ahead and add messages to be a message like this there we go
7:42:33
and now you should no longer have this error right here perfect but that's not
7:42:39
the only relation we need we also need a relation with the channel this message is being sent to so Channel ID is a
7:42:46
string and a relation of Channel
7:42:52
Channel at relation Fields Channel ID references
7:42:59
ID and on delete Cascade like this so let me zoom out so you can see that and
7:43:06
now we have to go ahead back into the channel and add the relation so let's
7:43:12
find the channel it's right here and after server ID go ahead and add
7:43:18
messages message like this perfect and let me just go ahead back
7:43:24
so the member here and let's write this messages with a lowercase M so messages
7:43:30
like this there we go perfect and now before we wrap this entire thing up
7:43:35
let's also add a deleted Boolean so deleted is a Boolean
7:43:42
with the default value of false so we're going to use a soft delete method once a
7:43:47
user attempts to delete the message we're not going to remove the record from our database but we are going to clear the content and we're going to
7:43:54
turn this to true and let's also add at index to be a channel ID and add that
7:44:01
index to be a member ID like this and let's also go ahead and write
7:44:07
created at to be date time of default and now
7:44:15
and updated as the update time at default whoops at updated ad like this
7:44:21
perfect so we've wrapped up our message model which will be for the channels now
7:44:27
we have to create a conversation model and a direct message model
7:44:32
so let's go ahead below that and write model conversation which is going to have an ID of string
7:44:39
at ID at default uuid like this and now it's gonna have two members so Member
7:44:47
One ID is going to be a string and number one is going to be a relation to
7:44:52
the member but since we already have a couple of relations to the member we have to give this one a name so relation
7:44:58
and go ahead and write number one like this and pass in
7:45:03
the fields which are Member One ID and passing the references which is an ID
7:45:09
and on delete Cascade like this perfect and do the
7:45:14
same thing for member two so I'm gonna copy and paste this and let's rename this to member 2 ID
7:45:22
like this and this one is going to be member two and this relation is going to be number
7:45:28
two as well and everything else can say the same actually not so we have to change this fills array to member to ID
7:45:36
like this great and now let's go ahead and let's find our member model and
7:45:43
let's just add uh let's just add these relations here so
7:45:48
to the conversation model using this Member One and member two so go ahead and find the conversation model
7:45:56
uh sorry not the conversational the member model right here and below the messages
7:46:02
go ahead and add conversations initiated like this to be a conversation like this
7:46:10
and a relation of Member One like this so can I zoom in I can great and we also
7:46:18
need another one which is going to be so you can copy this but this one is going to be called conversations
7:46:26
received like this and this one is going to be member two like this so we created
7:46:32
a relation back uh to the conversation model using the member one and member
7:46:37
two fields and in here we're gonna store them as conversations we initiated and
7:46:44
conversations we received like this so we can handle both being the person who
7:46:50
created a conversation with another member and also a person who got invited
7:46:55
for a one-on-one conversation by some other member so we need to handle both
7:47:01
of those cases perfect and now let's go ahead back inside of our conversation
7:47:07
model here and what we have to do here is just fix this warnings
7:47:12
so go ahead and add that Index right here for Member One ID and at that index
7:47:19
for member two ID like this and also let's go ahead and let's write
7:47:27
at that unique and let's write a combination of Member One ID and a member
7:47:34
to ID like this perfect so uh each conversation can only exist with a
7:47:41
unique Member One and member 2 ID so we cannot have more than uh we cannot have
7:47:46
two of these conversations with the exact same members because in every server we're gonna have a different
7:47:52
member ID ourselves and the other user is also going to have a different member ID themselves perfect and let me
7:47:59
actually see uh if I even need an index for this one it seems like I don't right
7:48:05
so it seems like it only asking for the member too so let's remove this Member One ID it seems like the only thing we
7:48:11
need is the member to ID if you're having issues you can just add both of them but as you can see when I remove
7:48:17
the two this is the error the warning but when I remove the one there is no warning so I can keep it like this so
7:48:23
let me just zoom out one more time so you can see how it looks uh in one line like that perfect and we are not done
7:48:31
yet so what we have to do now is we have to create our last model which is going to be direct message model so the reason
7:48:38
we have to create a different model and we cannot reuse this message one is because this message one is best to keep
7:48:45
separated and only used for the channel relation you can see that we have pretty strict Channel relations here so we can
7:48:51
go ahead and create a very similar one called direct message which is going to be used inside of one-on-one
7:48:56
conversations with the members so let's go ahead and write model direct message
7:49:03
like that which is going to have an ID of string at ID and default of your ID
7:49:10
like this it's going to have content which is a string and DB dot text and
7:49:15
it's going to have file URL which is an optional string and DB dot text like this now let's add a relation to the
7:49:22
member ID which is a string and member
7:49:28
which is going to be a member relation relation Fields number ID references
7:49:35
ID and on delete Cascade like this so let me zoom out so
7:49:41
you can see it great and we're also going to have a relation to the conversation we are in so conversation
7:49:48
ID is a string and conversation conversation like this add relation
7:49:55
builds conversation ID references ID and on delete
7:50:02
Cascade like this perfect so now let's go ahead and let's go inside of our
7:50:08
conversation here and below this member two let's go ahead and add direct messages to the direct message and an
7:50:17
array like this and that way we fixed the error for this one and now we have to go all the way to the member to add a
7:50:24
relation with the direct message so find the member right here and you can go just below
7:50:31
messages and just add Direct message like this direct message
7:50:39
and make sure this is direct messages like this so multiple perfect so we have
7:50:45
a relation with both of those now and we can go back safely inside of our direct message here and let's go ahead and zoom
7:50:51
in back and let's wrap this up by adding it a created add field which is a date's time
7:50:58
of a default value of now an updated ad which is dates time at updated at like
7:51:05
this and it's also going to have a deleted which is a Boolean with a default value of false
7:51:13
and let's just not misspel this so Boolean and let me just move it above these
7:51:19
dates like that and lastly let's just create these two indexes to fix these errors so at at index is going to be a
7:51:27
member ID and at that index is going to be a conversation ID like this perfect so make sure you have
7:51:34
no errors no warnings you can always go to my GitHub and just copy the entire uh Prisma schema and now let's go ahead and
7:51:41
push all of that so save that file let's shut down the application run npx Prisma
7:51:47
generate to add all of these new models to our node modules and npx Prisma DB
7:51:53
push to push those new collections to our planet scale or whatever you used
7:51:58
for your mySQL database there we go so all of that is ready and now we are
7:52:04
ready to modify our individual member page so
7:52:09
when I click on members did I start this let me just go ahead and start the application so npm run Dev
7:52:18
like this let's just wait a second for this to load
7:52:25
so basically what we're gonna do now is similar to the channels we have this
7:52:31
chat header which says the general Channel we're gonna do that now but for the member ID page and we can do that
7:52:36
now because we have all the necessary models to create conversations and then load the the other members name in here
7:52:43
right when I click on this user I expect their user to show perfect
Conversations Setup
7:52:49
so let's continue and first thing we want to do is create a util for uh
7:52:56
finding our one-on-one conversations or creating our one-on-one conversations so
7:53:02
what is the flow that's going to happen once I click on this member right here so we're going to check whether we
7:53:07
already have a one-on-one conversation with this user with this member or if we
7:53:13
don't we're gonna go ahead and create one because as opposed to channels which are immediately created and everyone can
7:53:20
be a part of them members don't work like that so we are only going to create a one-on-one conversation if anyone ever
7:53:26
clicked on that user great so let's go ahead inside of our lib folder
7:53:32
and create a new file called conversation.ts like this great and
7:53:38
let's go ahead and let's create two um two functions here first so what I
7:53:45
want to do is import our database from dot slash DB and I think you already
7:53:51
know I'm gonna replace that to add libdb like this perfect so let's go ahead and
7:53:56
first create our find conversation function so const
7:54:01
find conversation like this is going to be an asynchronous function I'm just going to zoom out just a bit like this
7:54:08
we're just going to take the member 1 iD which is a string and it's going to take a member 2 ID which is also a string
7:54:16
like this and that's going to be an arrow function so this is how it should look like in one line and inside let's
7:54:24
go ahead and write return awaitdb.conversation dot find first like
7:54:31
this where and like that open an array open an
7:54:38
object number one ID is equal to Member One ID from our props sorry params and
7:54:46
number two ID is equal to member 2 ID from our params right here and once we
7:54:54
find that user we're sorry that conversation let's include the entirety
7:54:59
of number one including their profile so we can load their name and image and
7:55:06
same thing for member two so include and also a profile true like this
7:55:14
perfect so we immediately return this a weight function in the find conversation great and now let's create another
7:55:21
function cons create new conversation which is an
7:55:28
asynchronous error function which takes in member 1 iD a member 2 ID and it is
7:55:35
an arrow function and this is how it looks like in one line great and inside of here we're going to open a try and
7:55:43
catch block inside of this sketch we don't have to log any errors instead we can just return null
7:55:50
like this and let's go ahead and write return awaitdb dot conversation dot create like
7:55:58
this data Member One ID number two ID like this so
7:56:05
this is a shorthand right this is the same thing as writing this just using a shorthand and let's also include team
7:56:12
number one and let's include their profile
7:56:17
true like this and same thing for member two include
7:56:24
their profile to be true like this perfect and let's go ahead and let's
7:56:30
just wrap this fine conversation inside a try and catch block as well so I'm
7:56:35
gonna head and write a try block here wrap this entire thing and in the catch
7:56:43
block I will just return now like this there we go just in case something goes wrong we safely return null instead of
7:56:50
blocking the entire application so now we have these two functions create new conversation and find conversation but
7:56:56
we're not using them every anywhere so at the top create a new function which we are going to export so export const
7:57:03
jet or create conversation which takes in which is an asynchronous function
7:57:09
which takes in the member one ID which is a string and a member two ID which is
7:57:15
a string like that perfect and let's go ahead and write let conversation is
7:57:21
equal to await find conversation using a member one ID and a member two ID and
7:57:29
let me just zoom out so first thing we're going to try conver a combination when where the first member is the
7:57:36
member one and the second one is the member two but we're also gonna do a pi pipe I'll wait find the conversation
7:57:44
of member 2 ID and a member one ID like this so we have a combination of the two
7:57:52
right if we cannot find it in this order we go ahead and try to find it in a reverse order like that perfect so all
7:57:59
of this is written in one line as you can see right here I know it's zoomed out but I just want to show you how it's
7:58:05
supposed to look great and if there is still no conversation after both of those combinations that
7:58:11
mean that we have to create a new conversation so conversation is now equal to a way to create new
7:58:18
conversation number one ID and a member to ID like this perfect and at the end
7:58:24
just return the conversation like this perfect so if you have a feeling you've
7:58:30
done something wrong here you can always just visit my GitHub and find this in lib conversation and confirm perfect now
7:58:38
let's go ahead and let's find our member ID page so I'm gonna close this I'm going inside of the app folder main
7:58:45
route server server ID find the conversation member ID and find the
7:58:50
page.esx perfect let's go ahead and let's create
7:58:56
the interface for this so interface member ID page is gonna have params
7:59:01
which are gonna have a member ID which is a string and a server ID which is
7:59:07
also a string like this let's go ahead and extract those params right here and
7:59:12
let's add the member ID page and I made a mistake here so let's name this props
7:59:18
member ID page props and member ID page props so it doesn't get conflicted with this constant right here perfect now
7:59:25
that we have that let's go ahead and write const profile to be await current profile from add slash lib current
7:59:32
profile which means we have to turn this page into an asynchronous function like that
7:59:37
if there is no profile we can return let me zoom in redirect the sign in from add
7:59:44
slash clerk so make sure you have this and as always I'm going to separate those two perfect
7:59:51
now let's go ahead and let's find the current member so cons current member is
7:59:57
equal to await DB which you can import from add slash libdb so make sure you add this line right here DB dot member
8:00:06
dot Pine first like this where server ID is equal to params.server ID
8:00:13
and profile ID is equal to profile dot ID so that is the current member and
8:00:18
we're also going to include our profile inside like this perfect
8:00:24
if there is no current member in that case something is going wrong and let's go ahead and return redirect
8:00:32
from next slash navigation to a slash page like this so I'm just going to move the redirect to the top perfect and
8:00:40
after this let's go ahead and let's get our conversation using our new library
8:00:46
so const conversation is going to be a weight get or create
8:00:51
conversation from at slash lib slash conversation so I imported that right here and let me just move it to the top
8:00:58
so get or create conversation which we just created here perfect let's go ahead
8:01:03
and write get or create conversation and pass in the current member dot ID as the
8:01:10
first ID and pass in the params.member ID as the other user so this is how that
8:01:17
looks in one line great so we're looking at a combination of our
8:01:24
currently logged in user and the member that we clicked on and then we're gonna find the both combinations whether we
8:01:31
initiated that conversation or they initiated it or if none of those combinations let's go ahead and create a
8:01:38
new one with us as the initiator because we pass in our prop as the first one
8:01:43
perfect and now let's go ahead and write if there is no conversation so if
8:01:48
something went wrong here in that case we cannot load this page so we're gonna do a return redirect open pointy bracket
8:01:56
slash servers and let's just go to params.server ID which is going to
8:02:01
automatically join the general Channel perfect and if we did manage to create a
8:02:07
new conversation or find one in that case let's extract the member one the member two from conversation like this
8:02:16
perfect and let's find const order remember is equal to member one dot
8:02:21
profile ID is equal to profile.id like this in that case we are member two
8:02:28
otherwise sorry the other member is member two otherwise it's Member One so basically what we are doing is we are
8:02:35
comparing both Member One and member two we are looking at their profile ID and if it matches our current profile ID we
8:02:42
are picking the opposite member because I want to get the other member from uh this two perfect I don't know which one
8:02:49
is going to be us and which one is going to be uh the person we are talking to right because either they could have
8:02:55
initiated this conversation or we could have initiated it if we initiated it then we are the member one otherwise
8:03:01
they are since we have no way of knowing that information using this code well what we have to do after we extract
8:03:06
those two from our found or created conversation is that we use the member one profile ID compare it with our own
8:03:13
and if that matches that means we are Member One so the other member is assigned to member two other wise we are
8:03:21
the member one great and now we can go ahead and add a div HEV with a class
8:03:27
name of BG Dash white dark is going to have VG Dash hashtag 31338 like this
8:03:34
Flex Flex Dash call and H dash full like this perfect and instead of rendering
8:03:40
member ID page you're going to render the chat header from add slash components slash chat slash uh chat
8:03:47
header and let's pass in the image URL which is going to be the other member dot profile dot image URL like this the
8:03:55
name is gonna be other member dot profile dot name like that server ID is
8:04:01
going to be params.server ID and type is going to be conversation like this
8:04:07
perfect so now if I refresh right here there we go my current conversation was
8:04:13
successfully created and it says Antonio are there that's here but my picture is
8:04:18
not showing here because we have to go back inside of the chat header and resolve that so let me show you what
8:04:24
just happened so I'm gonna open a new terminal and I'm going to run npx Prisma Studio here after I uh wrote that I have
8:04:33
opened my Prisma Studio inside and I'm gonna go ahead and open my conversations
8:04:38
right here and you can see that the new one was created having the member one to be let's see which member I assume
8:04:46
myself there we go the admin which is signed to this profile and another one which is the guest perfect so you can
8:04:52
check in your uh Prisma studio if that was correct if it wasn't correct so if
8:04:58
you're for some reason not being able to see this name go ahead and check inside of your terminal not in the Prisma
8:05:04
studio so where you're running the application and scroll up and try to see if there are any error messages here
8:05:11
right if there are go ahead and try to debug what just happened and one a piece
8:05:17
of advice I might give you after we've edited our Prisma schema make sure that
8:05:22
you shut down your application and re-run it again because even if you do MPX Prisma generate and DB push there is
8:05:29
still cash left in the next cache and all of that stuff so make sure you shut down the application run it again and
8:05:36
then try this so mine work from the first try if your hasn't and you are not
8:05:41
able to debug you can always visit my GitHub and go ahead step by step and see
8:05:47
the differences between my uh this what's it called get or create
8:05:52
conversation function my Prisma schema and find the differences and if you still can do that you can always jump in
8:05:58
my Discord and ask your question there everything can be resolved perfect so
8:06:04
now that we have this we can go back and visit our chat header so let's go ahead and visit our
8:06:12
components chat chat header here and now let's finally use this image URL right
8:06:18
here so let's go ahead and after this type Channel hash let's
8:06:24
go ahead and write type is equal conversation in that case let's go ahead
8:06:30
and write user Avatar and let's import this from dot dot slash
8:06:36
user Avatar and I'm gonna change that to slash components like this and go ahead
8:06:41
and pass in uh the source which is going to be the image URL and
8:06:48
go ahead and give it a class name of h-8w-8 on MD keep the same values
8:06:56
like this and margin right off to like this so let's go ahead and let's refresh
8:07:03
this and see if anything changed and there we go you can see that now it matches the member that I'm talking to
8:07:10
right here in the corner perfect so you can see how now I differentiate between
8:07:15
my channels and between my members and you can also look at the URL when I'm in
8:07:20
a channel it is slash channels Channel ID when I'm in the members it is slash conversation that specific member ID
8:07:27
that I am talking to perfect so for the other user they're gonna have a
8:07:32
different URL they're gonna have slash conversations and then my you my user id
8:07:38
because they are talking to me right so they're not going to share the URL but because of our conversation lib which we
8:07:43
created we are able to find all kinds of Converse combinations of those two users
8:07:48
perfect great great job so you successfully wrapped up uh the main
8:07:53
functionalities of initiating pages of channels and the members what we have to
8:07:59
do now is we have to implement socket i o so we can add a little indicator here in the top whether we are successfully
8:08:06
connected to the websocket server or not and regardless if you succeed in doing that or not it doesn't matter because
8:08:12
then we're going to start doing the messages and those messages can either work with a successful websocket a
8:08:19
combination or they can work with polling so regardless of what your experience is in in this next part of
8:08:26
the tutorial which can be a little bit tricky because next 13 has some problems with websockets
8:08:31
regardless of that you will be able to have a real-time ish experience in this
8:08:36
app great great job so far so let's go ahead and let's create our
Socket IO setup
8:08:42
socket IO Connection in order to do that we are first gonna have to install a couple of packages so let's shut down
8:08:48
our application I'm also going to close this Prisma Studio terminal I no longer need it and let's go ahead and let's run
8:08:55
npm install socket.io like this and after this has been installed let's go
8:09:01
ahead and immediately install npm socket.io Dash client like this so we
8:09:08
need one for the server and one for the front end great and you actually don't need to run your application right now
8:09:14
because we're going to do some coding so let's go ahead and let's create a new
8:09:19
folder so outside of everything we're going to create a new folder called pages
8:09:26
so pages is an old way of routing with next 12. but since next 13 app router
8:09:33
still has some issues with socket i o we're gonna leverage the fact that this Pages folder is still supported and in
8:09:40
here we're gonna go and initialize our i o uh connection and you didn't have to
8:09:45
worry about Pages being deprecated or something so next 13 is still in an
8:09:51
early transition and I am sure that because of all the Legacy code and applications the pages folder will be
8:09:58
supported for a very very long time so you don't have to worry and when an
8:10:03
update comes that socket IO is able to be done in the app folder I'm gonna
8:10:09
create instructions on how to do that but for now using the pages folder is perfectly fine for this solution so
8:10:16
let's go inside of this Pages folder create a new folder called API and
8:10:21
inside go ahead and create another folder called socket in side of this
8:10:26
socket folder create a file io.ds like this so that's going to be
8:10:31
our route slash API slash socket slash i o so in the pages folder we don't use
8:10:38
the route.ds instead we name our file as we want our route to be great so let's
8:10:46
go ahead and let's import server as net server from HTTP let's
8:10:55
import next API request from next like this and let's import server as a server
8:11:04
i o ROM socket.io like this and now let's save
8:11:11
this file and before we continue let's go inside of our types.ds file where we
8:11:17
have this server with members with profiles and let's go ahead and let some add some other Imports here so I'm going
8:11:24
to add import server as net server and socket from net like
8:11:34
this and let's import next API response from next like this and let's also
8:11:42
import server as socket IO server from
8:11:48
socket.io so we're going to create a custom response type so we can use it inside of this Pages route perfect so
8:11:55
let's go ahead and let's write export type next API response server i o is
8:12:03
equal to next API response and socket which is a type of socket and
8:12:11
server is a type of net a server and inside we have an i o which is Socket IO
8:12:17
server like this perfect so now that we have that we can head back into our
8:12:25
io.ds file inside of the pages API socket folder right here and let's
8:12:31
import next API response server i o from slash types like this let's go ahead and
8:12:39
turn off the body parser for this route so expert cons config
8:12:44
ABI body parser is false like this and
8:12:50
now let's write const i o Handler to have a request of next API request like
8:12:58
this and the response of next API response server i o like this let's open
8:13:04
an arrow function and first let's check if we already have a rest socket server
8:13:10
i o so we are only going to write this code if there is no so put an exclamation point if there is no
8:13:16
response dot socket dot server dot IO like this and then let's go ahead and
8:13:22
write const path to be slash API slash socket slash IO like that cons HTTP
8:13:31
server is a type of net server and it's a type of res dot socket.server as any
8:13:38
like this and now let's write const IO is equal to new server i o in
8:13:47
the first argument passing the HTTP server like this and in the second one going ahead and pass the path to be path
8:13:54
and add add trailing slash to be false now I am not exactly sure
8:14:03
why but this property is throwing me a typescript error but I've seen in other
8:14:08
projects it doesn't and I've also confirmed that it's not due to the version I have so I'm not sure if you're
8:14:14
gonna have this typescript error or not I have it so what I'm going to do is add a comment TS Dash ignore like this
8:14:22
because this is actually working for me there is a difference if I add this and if I don't add this so it's not true
8:14:28
that this doesn't exist as a property here you can even go ahead and look at the types inside I think we have this
8:14:36
server options inside which extends the engine options let's go ahead and see if I can look at
8:14:43
this and somewhere inside you should have the trailing slash well I cannot
8:14:49
find it right now but when I looked at myself it was somewhere inside but for some reason it's not being passed here
8:14:54
so again I don't know if you're gonna have this error or not but make sure you have the ad trailing slash false so
8:15:02
don't misspell it because you don't have typescript autocomplete here and let's just write
8:15:08
response.socket.server.io to be IO like that perfect and at the end response dot
8:15:13
end like this and Export default i o Handler like that perfect so we have our
8:15:20
API ready to connect to the socket i o and now let's go ahead and close this
8:15:25
and let's go inside of our components providers and create a new file inside
8:15:31
called socket-provider.tsx like that go ahead
8:15:36
and Mark this as use client like that go ahead and import create
8:15:42
whoops create context use context use effect and use state
8:15:49
from react like this and go ahead and import IO as client IO
8:15:56
from socket dot IO Dash client now let's create the type for our context so type
8:16:03
socket context type is going to be a socket of type any or
8:16:09
null like this and is connected it's going to be a Boolean like that perfect
8:16:15
now let's go ahead and write the actual socket context so const socket context
8:16:21
is equal to create context with the type of socket context type which we just
8:16:26
created above and it's going to be an object with a default value of socket now and is connected of false like this
8:16:34
perfect now let's go ahead and let's export a hook where we are going to use
8:16:40
this context so export cons use socket is an arrow function which just returns
8:16:46
use context and passing the socket context like this
8:16:51
great and now let's actually write the socket provider so go ahead and write
8:16:57
export cons socket provider so just make sure you export this
8:17:02
constant as well as well as this one and let's go ahead and let's pass in
8:17:08
uh the children sorry let's extract the children like this and let's go ahead and give them a
8:17:15
type of children.react.react node like that so we can actually
8:17:22
collapse this like that just so it's easier to look at and go
8:17:28
ahead and return this component where we're going to add a constant socket and set socket when we
8:17:35
use State and default is going to be null const is connected and a set is
8:17:42
connected of use State poles like this and now
8:17:48
let's write a use effect which we have imported don't forget the dependency
8:17:53
array here whoops and inside let's go ahead and let's add
8:17:59
const socket instance the new client iOS any so open it in Brackets
8:18:08
like this go ahead and open brackets again row says dot environment dot dot next
8:18:16
underscore public underscore site underscore URL with a question with an
8:18:23
exclamation point so I just want to quickly explain that this next public site URL is localhost by default in
8:18:31
development so that's why we don't add anything inside of our environment file but later when we deploy we are going to
8:18:38
change this next public site URL to match our deployment URL at the end so
8:18:45
this is all supposed to be one line like that and then go ahead and pass in the
8:18:50
options like this so I'm going to zoom in back the path is going to be slash
8:18:55
API slash socket slash IO and add trailing slash
8:19:01
is going to be false like that perfect now let's go ahead and let's add the
8:19:08
connect and disconnect events so socket instance dot on connect
8:19:15
pass in the arrow function set is connected to true
8:19:21
like this and socket instance dot on
8:19:26
disconnect whoops disconnect like this is going to be a narrow function which set is
8:19:34
connected to false like this then at the bottom we're gonna go ahead
8:19:39
and write set socket socket instance like this
8:19:45
and return an arrow function socket instance dot disconnect whoops
8:19:53
like this perfect and let's just go ahead and return
8:19:58
a socket context dot provider like that and render the children inside and go
8:20:05
ahead and pass in the value of socket and is connected like this
8:20:11
perfect so now we have this provider now let's go ahead inside of our app folder
8:20:18
inside of our main layout right here and let's go ahead and wrap everything
8:20:24
inside of the steam provider in a socket provider so socket Provider from add
8:20:30
slash components slash providers slash socket Dash provider and wrapping the
8:20:36
model provider as well as the children like this perfect and make sure you
8:20:41
imported socket Provider from add slash components provider socket provider so
8:20:47
now let's go ahead and let's create a socket indicator which is going to be inside of this corner right here which
8:20:55
is either going to be green or orange depending on if our connection was successful or not so in order to do that
8:21:01
let's go ahead and open our terminal and we have to add a new component from
8:21:07
chat CN called badge so let's go ahead and find the batch
8:21:14
component right here and let's go ahead and copy this for npm like that
8:21:21
I'm going to paste that here so npx a shared cnui at latest add batch great so
8:21:28
go ahead and press enter and just wait a couple of seconds and then confirm it of
8:21:33
course and there we go and now you can npm run Dev your application and let's go ahead now and let's create our socket
8:21:41
indicator so I'm going to close everything here I'm going inside of my components and inside I'm going to
8:21:46
create a new file socket-indicator dot TSX like this
8:21:52
let's mark this as use client like that and let's import use socket from dot
8:21:59
slash provider socket provider but I'm just going to change it to slash components like that and let's import
8:22:06
badge from ad slash components slash UI slash batch which we just added perfect
8:22:13
export cons the socket provider whoops socket indicator my apologies
8:22:20
is going to use the is connected status from use socket which we imported if we
8:22:27
are not connected in that case let's go ahead and return a badge
8:22:32
like this with a fallback of pulling every one second and let's go ahead and
8:22:39
give it a variant of outline and a class name whoops and the class name
8:22:46
of BG Dash yellow Dash 600 Text slash white and Border Dash none
8:22:53
like this perfect and you can go ahead and copy this return function and move
8:22:59
it outside of this if Clause so this is going to be if we are connected and instead of using BG yellow we're going
8:23:04
to use VG Emerald like this so let me just collapse this too so you can see
8:23:10
that better like that so all in one line I'm gonna
8:23:15
do the same thing here like that okay and let's just change the text inside of
8:23:21
this one which is going to be live real dash time updates like this perfect and
8:23:29
now let's go inside of our components chat chat header right here and let's go
8:23:36
ahead and find the end of this paragraph add a new div with the class name of
8:23:41
ml-auto flex and items Dash Center and inside render the socket indicator like
8:23:49
this which we just created so dot dot socket indicator and I'm Gonna Change it to components like this perfect so let's
8:23:56
see what's going on here now I'm going to refresh make sure you do npm run Dev to start your application and let's see
8:24:04
if we're gonna have any errors so right now it says fallback polling every second and there we go mine has
8:24:10
successfully connected so it's normal that in the first few seconds it doesn't connect and you can go ahead and check
8:24:15
your network tab to confirm that you're not having any additional errors uh for
8:24:22
your socket so let me just find the socket or i o perhaps Let me refresh and
8:24:27
see if that's gonna work and there we go you can see that my i o connections are not
8:24:33
failing and let me show you how it will look if something goes wrong so if you have a mismatch between uh your API
8:24:40
routes so I'm gonna go inside of my components providers socket provider right here so if I wrote an invalid URL
8:24:47
here let's add a typo here and if I attempt to refresh there we go you can
8:24:52
see that now it says fallback and in my network tab you can see that I'm having errors so double check that your pads
8:25:00
are correct double check that you have ADD trailing slash so this path API socket i o needs to match the server one
8:25:07
this next public site URL doesn't matter now because locally that's default localhost but later when we deploy we're
8:25:14
gonna have to change it and also let's go ahead and check the i o in our paths
8:25:21
so make sure that in your pages API you also have a matching API route and also add the add trailing slash right here
8:25:28
here perfect great great job so you successfully created the connection to
8:25:34
socket IO and now we can go ahead and start developing the chat component again if you try your best if you copy
8:25:41
my code and it still doesn't work it could be that it's just a specific issue with your firewall or something like
8:25:48
that but you don't have to worry because you can still continue the tutorial because we are going to have a live
8:25:53
polling as well as a fallback so let's go ahead and let's create our
Chat Input component
8:26:00
chat input which is going to be right here at the bottom so first thing we're going to do is we're going to do that
8:26:06
first for the channels so pick a channel like general or new text make sure you are inside of a channel and let's close
8:26:14
everything here let's go inside of the app folder inside of main folder
8:26:20
routes channels Channel ID page dot TSX like this and below the chat header add
8:26:28
a div which is going to say future messages so we're not gonna have them yet and give this leave a class name of
8:26:35
flex dash one like this so it takes up all the space and at the bottom go ahead
8:26:41
and add a uh chat input component like this and if you save you're going to get
8:26:48
an error because chat input does not exist yet so let's go inside of our components folder inside of the chat
8:26:56
folder and create a new file chat input.vsx like this let's go ahead and
8:27:02
let's mark this as use client and let's do a quick export const chat input like
8:27:08
this and return a div chat input just like that go back inside of the channel ID
8:27:16
page and now import the chat input from add slash component slash chat slash
8:27:21
chat input so you can keep this header and input together like this perfect and now if you save there we go so I have a
8:27:29
space taking up future messages and at the bottom I have a chat input perfect let's go ahead now and let's add this
8:27:38
chat input some props so interface chat input props is going
8:27:44
to have an API URL which is a string it's going to have a query which is
8:27:49
going to be a record of string and any it's going to have a name which is a
8:27:55
string and a type which can be either conversation if it's a one-on-one or a
8:28:01
channel so we're going to reuse this chat input for both one-on-one communication and on the Channel's
8:28:08
communication so that's why we are making this as modular as possible making it able to pass different API URL
8:28:15
and the relevant query so that we can reuse it in different places perfect now
8:28:21
let's go ahead and let's import import all as Z from Zod like this and
8:28:28
let's go ahead and quickly write the form schema so cons from schema is going to be Z dot object like that which takes
8:28:36
in the content which is z dot string with a minimum value of one and no need
8:28:41
to do any custom error messages because we are not gonna display error messages in the chat input so now let's go ahead
8:28:47
and let's extract all of those props here so we're going to have the API URL the query the name and the type like
8:28:56
this and let's just assign the props so chat input props like this perfect now
8:29:02
let's go back inside of the page so the channel page here where we render
8:29:08
the chat input and let's give it all of those props so name is going to be channel.name like that type is going to
8:29:15
be Channel API URL is going to be slash API slash
8:29:21
socket slash messages so we are going to create that route later right now it
8:29:27
doesn't exist yet but we're just preparing it and the query that this route is going to need is going to be an
8:29:32
object which has the channel ID which is channel dot ID and a server ID which is
8:29:37
channel.server ID like this perfect so now we no longer have any type errors
8:29:43
and now let's go ahead and let's create let's create our form hook here so cons
8:29:50
form is equal to use form from react Dash hook Dash form make sure you import
8:29:56
that okay and inside sorry before you open it go ahead and give it the type of
8:30:01
Z dot infer open pointy brackets again type off form schema like that and inside go
8:30:10
ahead and add a default values of content to be an empty string perfect
8:30:16
now let's add a resolver which is going to match this form schema so go ahead and then import Zod resolver from add
8:30:24
hook form slash resolvers slash Zod like that perfect let's go ahead and add a
8:30:31
resolver here so resolver whoops resolver single one
8:30:37
is going to be Zod resolver actually I'm typing this inside of default values my apologies so outside of default values
8:30:44
resolver is going to be Zod resolver form schema like this and add a comma
8:30:49
there we go so our form Hook is ready now and let's go ahead and write const is loading to be form Dot
8:30:57
dot form state is submitting
8:31:05
like that and let's write const on submit to be an asynchronous function
8:31:11
which has values which are a type of Z dot info type of form schema like that
8:31:17
and just log the values for now so lowercase b like that perfect now
8:31:24
let's go ahead and let's import everything we need for our form so import form form control warm field and
8:31:33
form item from s slash components slash UI slash form like this and let's also
8:31:41
go ahead and import input from s slash component slash UI slash input like this
8:31:50
perfect so let's go ahead and let's start styling our form now so go all the
8:31:56
way to the return function return this div remove this div and write form
8:32:02
go ahead and spread the form constant which we have from this hook right here inside I add a native HTML form element
8:32:10
and write on submit to be form dot handle submit and wrap our on submit
8:32:16
inside so we have access to these values inside perfect now let's go ahead and
8:32:21
let's write a single form field which is a self-closing tag like that go ahead
8:32:27
and give it a control of form dot control like that go ahead and give it a
8:32:33
name of content and give it a render go ahead and destructure the field like
8:32:39
that and immediately return a form item like this perfect inside of the form
8:32:46
item go ahead and return the form control like this and now let's add a
8:32:51
div with a class name of relative p-4 and pb-6 like that perfect inside of here
8:32:59
let's go ahead and let's create a button element here which is going to be a type of button so
8:33:06
okay let's do it like that give it a type of button that's important so it
8:33:12
doesn't accidentally get triggered when we press enter uh on click can for now
8:33:17
just be an empty Arrow function and give this button a class name of the
8:33:23
following so let's go ahead and let's write absolute absolute like this top Dash is seven
8:33:31
left Dash 8 like that height 24 pixels
8:33:37
with 24 pixels as well bg-sync 500 on dark
8:33:44
mode it's going to be bg-think-400 on Hover we're gonna change
8:33:50
it to BG Dash sync-600 like this
8:33:55
on dark hover so dark hover uh it's gonna have a uh let's see BG
8:34:05
dashing-300 is going to have a transition class rounded Dash full p-1
8:34:11
Flex flat whoops Flex item slash Center like this and justify Dash Center like
8:34:20
that perfect and inside we are going to render the plus icon from Lucid react
8:34:26
which is gonna have a class name of text Dash White dark is going to be tax Dash
8:34:34
and open a hex code 31338 like this so make sure you have
8:34:39
plus imported from Lucid react and I'm just gonna move it to the top right here okay so right now the only thing you
8:34:47
should have is this plus sign but we're gonna change that a bit okay let's scroll down right here
8:34:54
so outside of this button uh go ahead and add our input component which is a
8:35:01
self-closing tag it's going to be disabled on is loading which we have as
8:35:06
a constant and now let's give this a class name of bx-14
8:35:14
py-6 like this BG Dash sync 200 90 on
8:35:19
dark mode is going to be uh BG Dash sync 700 slash 75 border Dash none border
8:35:29
Dash zero Focus dash visible ring Dash zero like that it's also going
8:35:37
to be Focus dash visible ring Dash offset Dash zero like that text Dash
8:35:44
sync Dash 600 and on dark mode text sync Dash 200 like that perfect so now if you
8:35:51
take a look we have a beautiful input form uh right here great so uh this
8:35:59
button is going to be used to open a model to upload a file message so either
8:36:04
an image or a PDF file but we're gonna do that later what I want to do now uh is actually
8:36:10
try this out so one more thing I just want to do is after this input I'm gonna
8:36:15
create a div and I'm gonna go ahead and give it a class name of absolute
8:36:21
top Dash seven and right dash 8 like this and what I'm going to do inside is
8:36:28
I'm just gonna add a smile icon from Lucid react like this so make sure
8:36:35
you imported this as well great so this smile icon is going to be our trigger for an emoji model but we don't have
8:36:42
that yet for now what I want to do is actually test this out to see if there
8:36:47
is uh if we are actually logging these values so I'm going to go ahead and try this is
8:36:53
my message like that and let's just press and it seems to not be logging my
8:37:00
values so okay let's take a look uh if we passed everything we need in this simple perhaps we are missing I think I
8:37:08
know what uh what I forgot to add yes so I only added the class name to this input uh after the class name I also
8:37:15
need to add the placeholder which we forgot about so the placeholder is going to be quite Dynamic I'm going to zoom
8:37:21
out a bit just so you can see it in one line so open pointy brackets like this and go ahead and write message
8:37:28
and then open a special object if type is equal to conversation in that case
8:37:35
render the name of that user that we are texting otherwise go ahead and render a
8:37:44
hashtag plus the name of the channel that we are texting like that so let's
8:37:50
take a look at it now I'm going to remove this message here and there we go now it says message slash General if I
8:37:57
go here it says message new if I go here it says message edited audio this of course is not going to exist for the
8:38:02
audio it's going to be in a different way for members it doesn't yet exist we have to add it to in that page separately so let's focus on the
8:38:08
channels now perfect and one more thing we have to add to the input is we have
8:38:13
to spread the field like this perfect so now it should be working in a my inspect
8:38:21
element right here I'm going to try this is my message like that let me just
8:38:26
clear this and press enter there we go content this is my message perfect now
8:38:31
let's go ahead and let's actually submit that message to an API Quest so let's go
8:38:37
ahead and let's import axios from axios and let's import Qs from
8:38:43
query Dash string like this perfect let's go back inside of our on submit
8:38:50
function here let's change this to be a try and catch block let's get the error
8:38:56
and let's console log the error like that and in the finally actually no no
8:39:01
finally here my apologies so in the try block now go ahead and write const URL is going to be Qs dot stringify URL
8:39:09
the URL base is going to be our prop API URL which you can see in our page is
8:39:15
slash API socket slash messages like that and in the query we're just going
8:39:21
to pass the query which in our case is going to be this channel ID and server ID perfect and now let's go ahead and await
8:39:29
access.post URL and values like that perfect and make sure you name the prop
8:39:36
values like this so you don't get an error like I have perfect and what I expect now in my inspect element is a
8:39:43
404 error so I'm gonna go ahead and I'm gonna press enter and there we go we have a 404 not fine so now let's go
8:39:51
ahead and let's create that route so we can finally create our first message
Messages API
8:39:56
so now let's go ahead and let's create our failing API route which is currently
8:40:02
returning a404 so if you take a look at our Channel page file you're gonna know
8:40:09
that it goes to slash API socket slash messages so maybe you already guessed
8:40:14
that we're gonna do that inside not inside of the app router but inside of the pages folder so let me just find the
8:40:21
pages folder there we go so we're going to do it inside of the pages folder API is Socket inside of here so we have
8:40:28
access to this response which can accept sockets so we can send
8:40:34
it back to all connected users so let's go inside of pages API socket IO
8:40:39
and inside create a new file a message messages
8:40:45
dot DS like this perfect so let's go ahead and write that now but before we
8:40:51
continue let's actually go ahead and create a new lib so we have a lib called
8:40:56
current profile but this current profile due to its nature will not work inside of the pages folder so what we have to
8:41:03
do is we have to modify it to work for Pages folder so go ahead and copy that
8:41:08
and paste it and rename it current Dash profile Dash pages so we know it's only
8:41:15
for the pages folder and we can no longer use this out from Clark next.js instead we have to use get out from add
8:41:23
slash Clerk next.js a slash server like this and then we can
8:41:30
go ahead and use get out like this but we have to pass in the request so let's
8:41:36
get the request from this param next API request from the next package like this
8:41:42
and passing the request inside and everything else can stay the same so we
8:41:48
just replaced the out and we have to pass in the request because that's the way the pages folder work perfect so we
8:41:55
have this new thing now and now we can go back inside of pages API socket messages right here so let's go ahead
8:42:03
and let's write export default asynchronous function function Handler like that
8:42:11
and this function is going to have the request of next API request from next and the response of next API
8:42:19
response server i o from our custom types like this perfect now inside let's
8:42:26
go ahead and write if let me just zoom in so it request that
8:42:32
method is not post like this in that case return rest dot
8:42:38
status 405.json like this error method not
8:42:45
allowed like this allowed okay
8:42:52
and now let's go ahead and open a try and catch block so first let's resolve
8:42:57
the catch so catch error like this let's comes the log
8:43:04
messages underscore post
8:43:09
and let's just pass in the error like this and let's return response dot status
8:43:16
500.json with a message internal error
8:43:21
like this perfect so now we can go back inside of our try block and let's write
8:43:26
const row file is equal await current profile Pages like that and yeah let's
8:43:33
also go back inside of our lip fold their current profile pages and let's
8:43:38
just rename this to current profile Pages as well so we don't accidentally import it from this one which is used
8:43:46
for the app folder so I'm just going to close those and let's go ahead and import the current profile pages from
8:43:52
add slash lib current profile Dash Pages like that and let's go ahead and pass in the request like that perfect
8:44:00
and let's also immediately destructure the content and the potential file URL
8:44:06
from request.body like that and let's also go ahead and get this
8:44:12
server ID and channel ID from request.query like this perfect let's go
8:44:19
ahead and let's check if we don't have a profile so if there is no profile in that case you can go ahead and return
8:44:28
rest.status401.json with an error unauthorized like that perfect so let's
8:44:36
go ahead and copy and paste this and let's check the same thing for server ID so if there is no server ID status is
8:44:43
for 100 and error is server ID missing like that let's copy and paste this
8:44:50
and let's do this one for channel ID so the error is going to be Channel ID
8:44:56
missing let's copy it again and this one is going to be for the missing content so if there is no
8:45:02
content in that case content missing like that perfect now let's go
8:45:08
ahead and let's import our database util so import DB from add slash lib DB like
8:45:13
that let's go below this check for content and let's go ahead and get our server so
8:45:19
cons the server is equal 08db.server dot find first like this
8:45:24
where ID is server ID as string members is sum profile ID is equal to
8:45:35
profile dot ID so we are just confirming that the user trying to send this message is actually a part of this
8:45:40
server and let's go ahead and let's include the members
8:45:49
like that perfect so if there is no server in that case
8:45:55
return rest.status404.json
8:46:00
with a message of server not found so message server not found
8:46:07
like this perfect now let's go ahead and let's find the channel so once the
8:46:13
channel is equal awaitdb.channel dot bind first
8:46:18
where ID is channel ID as string like that and server ID is serve whoops
8:46:25
server ID is server ID as string and instead of semicolons we are using
8:46:30
commas like that and let's just copy and paste this check for the server so if there is no channel
8:46:36
it's a 404 message saying Channel not found like this and now let's go ahead
8:46:43
and let's try to find the member so const member is equal to server dot members dot find get the individual
8:46:50
member like that if member dot profile ID
8:46:56
is matching the current profile dot ID like that so we find one member perfect
8:47:02
and let's go ahead and copy this again if there is no such member so if in the
8:47:08
entire member list of the server we could not find one that matches our profile ID let's go ahead and return
8:47:15
member not found because that is not a part of our server perfect and now let's
8:47:21
go ahead and finally create the message so const message is going to be equal to await db.message dot create
8:47:29
data is going to be content file URL Channel ID which is going to be Channel
8:47:36
ID as string like this member ID which is going to be this member which we
8:47:41
found in this constant so member dot ID like that and let's go ahead and let's
8:47:48
include member like that and let's also include profile
8:47:56
true like this perfect and now we can already just do this return
8:48:03
response dot status of 200.json message like that but I also want to do
8:48:11
something else I want to immediately emit a socket i o to all the active
8:48:16
connections so the way I'm gonna do that is by creating a unique Channel key so const Channel key is going to be open
8:48:24
backticks chat open columns open an object Channel ID
8:48:31
comma column messages like this perfect so we are going to watch this chat
8:48:38
Channel key also when we create a hook for watching socket messages on the front
8:48:45
end so we're gonna get back to this constant later to confirm that you don't do any typos here and let's just do
8:48:52
response a question mark socket question mark server question mark IO dot oops
8:48:59
question mark dot emit let's pass in the channel key yes the first argument and
8:49:04
the new message as the second argument there we go and now let's go ahead and
8:49:10
let's open our Prisma studio so we can watch our newly created message because currently there is no other way so npx
8:49:16
Prisma Studio like this and I'm gonna go ahead and open my
8:49:24
message table right here as you can see it's currently empty so let's now try
8:49:30
I'm also going to open inspect element here just to confirm there are no errors when I type so hello there let's send
8:49:38
it seems to be working because this was disabled okay and let's go ahead and
8:49:44
let's look at our Prisma Studio where I have the message and let's see if a new one was there and
8:49:50
there we go content is hello there we have the member ID we have the connection to the member Channel ID the
8:49:56
deleted status is false everything seems to be working fine great now let's go
8:50:02
ahead and create a model for uploading file messages
Message Attachment
8:50:08
so let's go ahead and let's create this pop-up right here which is going to enable us to send file messages so what
8:50:16
I'm going to do is I'm going to go inside of hooks use model store right here and inside of
8:50:25
this use model store we're gonna have to add a new model type which is going to be message file like this and we're also
8:50:34
gonna have to add an API URL which is going to be an optional string and a
8:50:41
query which is going to be an optional record of string and any
8:50:47
uh inside of this model data right here perfect so now let's go ahead
8:50:54
and let's find the most appropriate model we can copy so inside of models the model I want to copy is the initial
8:51:02
model because it already has the Drop Zone inside so copy the initial model and let's go ahead and let's rename this
8:51:09
to message file Dash model dot DSX like this so make sure you are inside of
8:51:15
message a file model here let's go ahead and let's rename it to message a file
8:51:21
model like that and now what we have to do is change a little bit of how it
8:51:26
works so first things first let's go ahead and remove this use effect for mounting let's go ahead and remove this
8:51:33
state for is mounted and let's remove this if clause for if it is mounted
8:51:39
perfect and now below Above This use router let's go ahead and add const is
8:51:45
open on close type and data from use model from add slash hooks use model
8:51:51
store so make sure you add this hook Books use model store import here perfect and now let's go ahead and let's
8:51:59
create a constant is model open to be is open and type needs to be a message
8:52:08
file like this and then we're going to use this is model open to handle our
8:52:16
open status so let's change this dialog open to not be hard coded but to use ismodel open and now let's go ahead
8:52:24
and let's create our const handle close function so handle close
8:52:32
like that we're just going to reset the form and call the on close which we extracted from the use model here
8:52:39
and now let's go ahead and go to our dialog and add on open change to be
8:52:46
handle closed like this perfect so of course we're gonna have to modify it even more but for now this is enough for
8:52:54
us to go inside of the components providers model provider right here and
8:53:00
add the message file model from dot dot slash models message file
8:53:06
model and I'm just going to change it to slash components like this there we go so add the message file model and now we
8:53:15
can go ahead inside of our chat input here the cell components a chat chat input go
8:53:23
ahead and the structure on open from use model so we have to
8:53:29
import that use model from add slash hooks use model store so make sure you have this new import right here inside
8:53:36
of the chat input and then let's find the button which we have an empty
8:53:41
Handler on and let's replace this to call on open message file and the data
8:53:47
it needs is going to be the AP URL and the query like this so make sure you
8:53:54
pass in both of those perfect and now let's go ahead and let's already try
8:53:59
this out so if I click here there we go I have this initial model opening perfect so now we'll keep it opened make
8:54:07
sure you pass in both the API URL and the query that it is the correct model and I can close this and I can go inside
8:54:14
of components models message a file model right here perfect so what I'm
8:54:21
going to do is I'm going to remove the name from the form schema so we're
8:54:26
not going to need that and I'm also going to go ahead and change the title right here so instead
8:54:34
of customize your server it's going to be add an attachment like this and I'm
8:54:40
going to change this description to be send a file as a message like this I'm
8:54:48
gonna go to this form right here and I'm gonna find where is the form
8:54:54
field that renders the input for the server name and I'm going to delete that
8:54:59
entire form field so let me zoom out so you can see so leave this form field
8:55:04
with the file upload but remove this form field with the form item label and
8:55:10
an input like this so remove that entire thing and just zoom in there we go let's
8:55:16
change the button from create to send like that and now let's go ahead and
8:55:24
let's change this file upload endpoint to use the message of file so if you
8:55:30
remember in the file upload we are either allowing a message file all a server image that is because inside of
8:55:38
our core file of upload sync router we allow server image which only accepts an image
8:55:45
but for our message file we accept both an image or a PDF so you can see the text here change to images and PDFs
8:55:53
perfect so let's go back inside of our message file model here right now and
8:55:58
let's go ahead and let's change our on submit function here so it's going to be a little bit
8:56:04
different and we have to go ahead and let's actually remove this use effect we're not going to need it let's remove
8:56:09
the form message and form label and let's remove the input import perfect
8:56:14
and instead let's go ahead and let's import Qs from query Dash string like
8:56:20
this perfect inside of the on submit function right now we're gonna go ahead and generate our URL so const URL is
8:56:28
equal to qs.stringify URL like that and let me just expand my screen a bit okay so
8:56:34
stringify URL inside passing the URL to be API URL but
8:56:40
we don't have it yet because we have to destructure it from our data so let's find our data right here we have it from
8:56:47
the use model and let's go ahead and let's uh extract API URL and query from
8:56:53
the data like this perfect so now we can go back inside of this on submit function and add a pi pipe empty string
8:57:01
here because it's a possibility that this API URL has not been passed let's also pass in the query like that
8:57:08
and after that is done let's go ahead and write axios.post like this instead
8:57:13
of this we're going to add this newly generated URL using query string like this and let's go ahead and spread the
8:57:22
values like that and add content manually to the values.file URL like this there we go
8:57:29
and let's just see okay yes let's go ahead and rename the form schema image
8:57:34
URL to file URL and let's change the server images required to attachment is
8:57:40
required for a proper message and let's also do the same thing in default values we don't need the name and let's change
8:57:46
this to file URL there we go and now in here we should no longer have this error
8:57:53
for the content right here and we no longer need the window.location.reload instead we can
8:57:59
call the on close function which we have right here the structured from the use
8:58:04
model perfect and let's just go ahead and change this name to be file URL like
8:58:11
this perfect so let's go ahead and let's try that out
8:58:16
now so I'm gonna go ahead and I'm gonna select an image right here which is my
8:58:23
YouTube profile picture and after I click Send right here
8:58:30
let's see if he's going to close the model so this would indicate that it is successful so I'm going to refresh right
8:58:36
here and I should have I sent a couple of messages so don't get scared I have a lot of messages but there we go this is
8:58:44
my newest file which uses the upload thing and has a file URL here so let me just go ahead and remove all of my
8:58:51
messages you didn't have to do this but I just want to demonstrate to you uh that it's working so I'm going to refresh here this Prisma Studio there we
8:58:58
go no messages uh inside let's just wait a second for it to load no messages but if I go ahead
8:59:05
uh and let's well you know what let's do this let's actually go back and let's
8:59:11
find our on submit function and instead of using on close let's use handle close
8:59:17
so this is going to reset our form as well like that so we have handle closed
8:59:22
reset uh written here perfect okay let's try again so I'm gonna go ahead and upload my
8:59:30
profile picture from YouTube I'm gonna go ahead and click Send like
8:59:36
this and let's go ahead and refresh this
8:59:41
and in a couple of seconds there we go so now you can see the file URL right here perfect and one thing I want to
8:59:49
bring your attention to is that we currently don't have a way to display PDF files so I'm going to upload a PDF
8:59:56
file in here and you're gonna see that we see nothing is happening we
9:00:01
successfully uploaded it but nothing is happening so what we have to do is we have to go back to our file upload
9:00:07
component so I'm going to close everything I'm gonna go inside of components inside of file Dash upload
9:00:13
right here and we have a solution for rendering images right but we don't have
9:00:18
a solution for rendering uh PDF files so go below this if Clause right here
9:00:24
and let's go ahead and render if there is a value and if file type is equal to
9:00:30
PDF in that case return a div and let's go ahead and let's give this
9:00:35
div a class name of relative blacks items Dash Center p-2 margin top
9:00:42
Dash 2 like this rounded Dash MD VG Dash background slash 10 like that inside
9:00:50
render a file icon from Lucid react so make sure you have file icon imported from Lucid react like this let's give
9:00:57
this file icon a class name of h-10w-10 pill Dash Indigo Dash 200.
9:01:06
stroke Dash indigo-400 like that and inside add an href like this
9:01:16
and the href is going to point the value like that
9:01:24
okay let's give it a Target of underscore blank so it opens in a new
9:01:30
file and let's give it a Rel of no
9:01:35
opener like this no rather like that and let's give it a class name of ml-2
9:01:43
backslash SM like this so you can already see some progress here text Dash
9:01:48
Indigo Dash 500 dark text Dash indigo
9:01:54
um text Dash Indigo 400 whoops
9:02:00
and hover underline like this okay and
9:02:06
inside we're going to render the value like this there we go perfect and we
9:02:12
also have to add a delete button so I'm just gonna copy this button from our my
9:02:17
if Clause to render the image and I'm going to paste it below this href here like that
9:02:23
and let's just modify it a little bit so I'm going to use minus top
9:02:29
2 and I'm going to use minus right to like this to position it just a
9:02:36
little bit better so let's take a look at this now and there we go so now you can click to open this file and you can
9:02:41
also remove it like that so perfect now I can add a PDF file for example and I
9:02:48
can upload that as well safely and let's click Send like that and in my Prisma
9:02:54
Studio I should have a new message now which successfully has my uh
9:03:00
PDF file perfect so you have finished the file upload uh configuration now we
9:03:07
just have to do the little Emoji thing great great job so far let's go ahead and let's create this
Emoji bar
9:03:14
Emoji pop-up right here so first thing we have to do is we have to add a
9:03:19
popover from chat cnui so let's go ahead and let's find the popover component
9:03:25
right here let's go ahead and copy the installation and let's go ahead and install it in our
9:03:33
terminal so I'm going inside of my terminal here and I'm going to shut down the Prisma
9:03:39
Studio I'm going to shut down my application and there we go npx chat cnui latest add popover like this
9:03:46
confirm the installation by pressing Y and after that is done we're gonna have
9:03:51
to install our Emoji package so go ahead and run the following npm install
9:03:58
Emoji Dash Mart at emoji-mart slash data and at Emoji Dash
9:04:09
Mart slash react so let me zoom out so you can see it in one line NP npm
9:04:14
install Emoji Dash Mart at Emoji Dash mark data and add emoji-mart react like
9:04:21
that and go ahead and press enter and after all of this has been installed go
9:04:27
ahead and npm run Dev your application again great so let's go ahead and let's
9:04:34
find where in our chat input we have this little message right here
9:04:40
so refresh your application of course and let's go inside of components chat
9:04:45
chat input right here let's find this smile icon and let's replace it with
9:04:51
Emoji picker like this and don't import it from anywhere so just save the file
9:04:57
and you should get an error because we don't have this Emoji picker anywhere so now let's go ahead and let's create it
9:05:03
I'm going to close everything I'm going inside of my components and create a new file Emoji Dash
9:05:10
picker.tsx like this perfect and now let's just go ahead and Mark this as use
9:05:15
client like that and let's export const Emoji picker like that
9:05:21
and let's return a div saying Emoji like that let's go
9:05:27
back inside of our chat chat input and now we can safely import the Emoji
9:05:32
picker from dot dot slash Emoji picker and I'm going to replace that to slash components like that and the error
9:05:40
should go away and now you have a text saying Emoji here great so let's go back
9:05:45
to the Emoji picker component inside and let's go ahead and write an interface so
9:05:50
interface Emoji picker props is going to be it's gonna have on change
9:05:58
value which is a string and a void like that so go ahead and extract the on
9:06:04
change from here and map it to Emoji picker props like this great now let's
9:06:11
go ahead and let's import everything we need from the popover component so import the following from add slash
9:06:18
components slash UI slash popover which we just added so pop over
9:06:25
popover content and pop over trigger like this great instead of rendering a
9:06:32
div we are going to render a popover component like that and go ahead and add pop cover
9:06:40
trigger component and inside render a smile icon from lucidreact so make sure to add this
9:06:47
import I'm gonna move it to the top like that and let's go ahead and give this smile a
9:06:52
class name of text Dash sync and it is a self-closing tag so let's just make sure
9:06:58
we close it so text Dash sync Dash 500 on dark mode is going to be text
9:07:04
sync-400 on Hover it's going to use text sync-600 on dark hover it's going to use
9:07:12
text sync-300 like that and it's going to have a transition class like this there
9:07:19
we go so now we have our emoji icon back and you can see how it has a nice hover effect perfect outside of the
9:07:26
popover trigger go ahead and add the popover content which we have imported
9:07:32
and go ahead and give it a side of right like that give it a side offset of 40
9:07:39
and let's just go ahead and render these underneath each other like this and let's go ahead and give it
9:07:47
a class name of BG Dash transparent like that border Dash none Shadow Dash none
9:07:55
drop Dash Shadow Dash none and margin bottom of 16 like that and inside we are
9:08:02
going to render a picker uh working together a picker from emoji
9:08:08
Mart react so before we do that let's actually import that here so let's import
9:08:14
directly picker from at Emoji smart react let's import data
9:08:22
from at emoji Dash mark slash data like this and let's
9:08:31
also just prepare use theme from next slash themes like that we're going to
9:08:36
use it in a moment great let's go back inside of the popover content and let's add our picker which is a self-closing
9:08:43
tag like that and let's go ahead and let's give it the data of data let's
9:08:49
give it an own Emoji select like this to get an emoji which is a type of
9:08:57
string like this and on change Emoji dot native so this is actually not
9:09:04
a string let's give it an any like that so let me zoom out so on emoji select
9:09:09
like that get this Emoji object and call the on change function with emoji.native
9:09:15
which holds the string like this so let's save this and let's see if this is
9:09:22
working right here so once I click here there we go I have an emoji popping up
9:09:27
perfect but one thing that doesn't work is when I switch the light mode it is still in dark mode so let's go ahead and
9:09:34
resolve that so switch the light mode if you prefer and go ahead and add a const
9:09:40
resolved theme from use theme which we imported just a moment ago and now use
9:09:48
this resolved theme and give it to the speaker here so theme is resolve theme
9:09:53
like that perfect and I'm just going to refresh and now there we go now it's white and
9:10:01
if I go ahead in dark now it's dark perfect and I think that I'm seeing a
9:10:07
little drop shadow here so let me just see if I can resolve that uh yes so I
9:10:13
have a Shadow Dash none instead of none as it should be like that and I think
9:10:18
that's gonna resolve that little Shadow there we go perfect and all we have to do now is actually add some
9:10:24
functionality because right now when I select I have an error so let's go ahead
9:10:30
and let's go back to our chat input component so components chat chat input
9:10:35
right here and on this Emoji picker go ahead and give it an on change like this
9:10:42
get the Emoji which is a string like that and do a field dot on change so I'm
9:10:49
just going to zoom out so you can see it in one line field dot on change and go ahead and open backticks
9:10:56
reuse the current field value and then just render an emoji next to it
9:11:02
like that so Emoji field on change what is the current value and add a space and
9:11:09
just an emoji like that so let's go ahead and write test let's click here let's
9:11:15
click somewhere and there we go you can see that an emoji has appeared here perfect and now I can send that message
9:11:22
and it is going to have an emoji perfect great great job
9:11:28
and while we are here uh let's also reset this form once we send the message
9:11:33
because right now I submitted a message but this stayed here so let's just quickly go inside of our on submit
9:11:40
function here and after the axis post let's go ahead and let's do form dot
9:11:46
reset like that and let's go ahead and let's add a router so const router use
9:11:52
router from next slash navigation so make sure you add this import for next slash navigation I'm going to move it to
9:11:58
the top and you can remove this import for smile and what I'm going to do is
9:12:04
also call router.refresh like this great so now if
9:12:09
I try and write a message this is a message and after I submit and it's successful it's cleared that's exactly
9:12:15
what I want perfect we are now ready to render our messages
Chat Messages component
9:12:21
so let's go ahead and let's finally render some messages or at least prepare
9:12:26
the chat messages component so we have to go all the way back to our app for
9:12:33
the main routes servers server ID channels Channel ID page right here and
9:12:39
we can now remove this div which says future messages and instead we can render the chat messages like this if
9:12:47
you save you're of course going to get a mirror so just make sure to refresh the page so you have this error visible and
9:12:53
now let's go inside of our components folder inside of chat and create a new
9:12:59
file chat Dash messages.tsx like that let's go ahead
9:13:04
and let's mark this as use client and let's just do an export const chat
9:13:10
messages like that and return 8 div saying chat messages there we go now go
9:13:17
back inside of the channel page and just import that from add slash
9:13:22
component slash chat slash chat messages so the same way uh we did for the chat
9:13:28
header input and now chat messages and if you save the error should go away so
9:13:33
let's go back inside of this uh component now and let's write an interface that we need so interface chat
9:13:42
messages props it's gonna have a name which is a string it's going to have a
9:13:48
member which is a type of member from at Prisma slash client it's going to have a chat ID which is a string it's going to
9:13:56
have F Ur sorry API URL which is also a string a socket URL which is a string a
9:14:04
socket query which is going to be a record of string and string like that
9:14:12
a param key which can either be Channel ID or
9:14:17
conversation ID like that and param value which is a string and a
9:14:25
type which can be either Channel or conversation so we need all of this
9:14:31
information to create a modular chat messages component which can be reused both in one-on-one conversations and in
9:14:39
Channel conversations perfect so now let's go ahead and let's extract all of
9:14:45
those values here so I'm gonna go ahead and write name member
9:14:52
chat ID API URL socket URL socket query
9:14:58
param key Ram value and type like this and let's assign all
9:15:06
of those to chat messages props like this and you should have no errors perfect now let's go back to the
9:15:14
page.dsx right here and let's go ahead and give it all of those values so member is going to be the current member
9:15:20
which we have name is going to be channel.name type is going to be Channel because we
9:15:29
are in Channel ID page for the conversation we are obviously going to change it to conversation API URL is
9:15:35
going to be slash API slash messages so this is where we're going to fetch our messages from and then socket URL is
9:15:43
going to be slash API slash socket slash messages so this is going to be where we are triggering new messages great and
9:15:51
now socket query is going to be a channel ID with Channel dot ID and
9:15:57
server ID with server dot whoops with channel.server ID like that param key is
9:16:06
going to be Channel ID like that and program value is going to be Channel dot
9:16:11
ID like this perfect and let's just change uh after name let's also add a
9:16:19
chat ID to be Channel dot ID like that there we go so member name chat ID type
9:16:25
API URL socket URL socket query param key and parent value and now you should
9:16:31
have no errors here perfect so let's go inside of chat messages now and let's go
9:16:37
ahead and let's give this div a class name of flex-1 so it takes up all of the
9:16:44
space blacks Flex Dash call py-4 and overflow Dash Y dash Auto like that
9:16:53
perfect now let's go ahead and let's replace the Stacked text chat messages
9:16:59
with a self-closing div so it's going to be a self-closing div with a class name
9:17:04
of flex dash one like that and then below that div we're going to
9:17:10
render chat welcome like this we don't have that so we're going to get an error
9:17:15
chat welcome is going to have a type of type and the name of name like that so
9:17:21
let's go ahead and let's create the chat welcome now so inside of chat components create a check welcome.dsx
9:17:29
let's go ahead and let's uh write export const chat welcome like
9:17:36
this and return adiv chat welcome like that go back to your chat messages and
9:17:43
now you can import chat welcome from dot slash chat welcome and I'm just gonna keep it separated and no need to
9:17:49
transform it in at slash components because they are in the same folder great and now let's assign this types
9:17:56
inside of the new chat welcome component which is right now right here at the bottom great so let's go ahead and write
9:18:02
an interface here so interface chat welcome props
9:18:08
like that are going to be named which is a string and type which can either be a Channel or a conversation like that so
9:18:16
even that is going to be dynamic now let's go ahead and extract both of those so name and type and let's map them to
9:18:23
the props chat welcome props like that perfect and you should now no longer have these errors in the chat messages
9:18:29
component great now let's go ahead and let's give this div a class name so
9:18:34
class name space Dash y-2 bx-4 and margin bottom Dash four let's remove
9:18:41
this text now and let's right type is Channel in that case go ahead and render a div
9:18:49
with a class name of H dash open square brackets 75 pixels
9:18:56
w-75 pixels as well rounded Dash full BG Dash sync-500 on dark mode it's going to
9:19:04
be BG Dash sync-700 is going to be a flex items Dash Center
9:19:10
and justify Dash Center as well and inside go ahead and render a hash
9:19:17
from Lucid react so make sure you have this import and let's give this Hash a
9:19:22
class name of h-12 w-12 and text Dash white like that there we go so now you
9:19:31
can see that we have a nice little hashtag here because this is a channel perfect now let's go ahead and let's go
9:19:38
below that and let's add a paragraph here with a class name of text Excel MD
9:19:44
text 3XL and font Dash bulb like that and inside we're going to dynamically
9:19:50
render using type equals Channel if that is the case we're
9:19:55
going to write welcome to and the hashtag otherwise we're going to just not render
9:20:03
anything and then we're going to render the name so this is going to say welcome to slash General but when we can go to
9:20:10
one-on-one conversations it's just going to say the name of the person we are speaking to so no need to say welcome to
9:20:16
that person's name but we if we are in the channel we want that to appear perfect and now let's go ahead and below
9:20:24
that and add another paragraph with the class name of text sync Dash is 600 dark text-sync
9:20:32
400 text Dash SM like that and inside go
9:20:37
ahead and let's dynamically render so if type is Channel
9:20:43
in that case go ahead and render in tactics this is the start of the hashtag
9:20:51
open a special object name Channel like that otherwise go ahead and render
9:20:57
backticks again this is the start of your conversation with the person we are
9:21:04
speaking to so just the name like that there we go so now this says welcome to General this is the start of the general
9:21:10
Channel if I switch to new text it says new text new text and new text here but when we come to our members we don't
9:21:16
have that yet but when we add it it's gonna say this is the start of your conversation with Antonio and he's just
9:21:22
gonna say Antonio here without this hashtag icon perfect so we just created our chat welcome component and now we
9:21:30
can actually go back to our chat messages and we can start actually fetching the data
9:21:37
so let's go and let's install the 10 stack react query package so I'm going to go inside of my terminal and I'm
9:21:44
going to write uh let's just write npm install at 10 stack slash react Dash
9:21:51
query like this so install that package right here and then make sure you do npm
9:21:58
run Dev again like this now let's close everything just to refresh your
9:22:05
localhost go inside of components go inside of providers and create a new file called query Dash
9:22:12
provider.dsx like that go ahead and Mark this as use client
9:22:18
import query client and query client provider
9:22:23
from at 10 stack slash react query and import use state from react go ahead and
9:22:32
write export const query provider which is going to accept the children and let's go ahead and give these
9:22:39
children a type of react.react node like that go ahead and return
9:22:46
a query client provider like this and just render the children inside now
9:22:52
let's go ahead and let's create a cons query client is equal to use state
9:23:01
open an arrow function new query client like this so just that we don't need the
9:23:07
set query client we can just work with this and pass in the client to be the query client like that perfect so now
9:23:15
that we have that let's go inside of our uh app folder and find the global
9:23:22
layout.dsx and now we have to go inside of our socket provider and just wrap the
9:23:29
children in the new query provider so query Provider from add slash components
9:23:34
slash providers slash query provider so this component which we just created
9:23:39
like that make sure you added the proper import from add slash components
9:23:45
providers query providers so not from any package great and now we are ready
9:23:50
to create the use chat query hook so let's go ahead and do that go inside of
9:23:57
hooks and create a new file use Dash chat Dash query dot DS like that let's
9:24:04
go ahead and let's import Qs from query Dash string
9:24:09
let's import use params from next slash navigation
9:24:14
and let's import use infinite query from 10 stack react query and let's also add
9:24:21
import use socket from add slash components providers socket provider
9:24:26
like that let's create an interface chat query props which is going to accept the
9:24:32
query key which is a string it's going to accept API URL which is a string Ram
9:24:38
key which can either be Channel ID or conversation ID depending of whether
9:24:45
this is used inside of one-on-one conversation or a channel and a param value which is a string like
9:24:53
that great now let's go ahead and let's write export const
9:24:59
use chat query like that go ahead and add the query key the API
9:25:06
URL the param key and the parent value like that and just map them to chat
9:25:11
query uh props like this there we go
9:25:17
and let's go ahead and return this and now let's extract
9:25:23
the is connected from our socket so const is connected
9:25:29
from use socket like that and const Rams is equal to use params like this and now
9:25:37
let's go ahead and let's create a function to fetch our projects so const fetch projects
9:25:43
my apologies const fetch messages like that is asynchronous
9:25:50
go ahead and extra open the object page
9:25:55
a ram is going to be undefined so this is gonna be a page for Ram is going to be our cursor for infinite loading right
9:26:02
we're going to have to modify the API for messages for that so get this page for Ram and now let's
9:26:08
generate the URL using Qs so const URL is equal to qs.stringify URL let's get
9:26:16
the base URL which is API URL prop the query is going to be a cursor which is
9:26:23
Page param and open this uh kind of like an array
9:26:29
so square brackets and write param key which is going to be param value like
9:26:35
that so either a channel ID that we are querying the messages from or the conversation ID that we are querying the
9:26:41
messages from so this way we can reuse this use chat query for both one-on-one conversation and for the channels great
9:26:48
and let's also add options here to skip null true like this perfect now let's go
9:26:55
ahead and write const response is await fetch URL and return
9:27:01
response.json like that perfect so now we have our const fetch messages function Here and Now
9:27:07
let's go ahead and let's actually write the query so const data fetch next page
9:27:13
has next page is patching next page and status
9:27:21
all of that from use infinite query like
9:27:26
this and go ahead and give it a query key
9:27:32
which is going to be an array and query key inside
9:27:38
a query function which is going to be fetch projects sorry fetch messages like
9:27:45
that and get next page param which is going to take the last page and it's going to
9:27:51
return last page question mark dot next cursor so make sure to put the question
9:27:57
mark here because there is a possibility that the API fails and then the last page is not going to return this and
9:28:03
your site will crash and now we have something cool here called refetch
9:28:08
interval so we can do it every second by default so this is what I was talking
9:28:13
about this is polling right so it's going to refetch all messages every second uh well not all messages but this
9:28:20
specific page that we are on so using this you can actually enable some kind of real time for your users this is what
9:28:26
I was talking about even if your websocket is not working you can still rely on this for a pretty good experience but since we do have web
9:28:33
sockets we're going to do a conditional if we are connected so if our websocket is working in that
9:28:39
case false otherwise use the polling so only if our websocket server fails and
9:28:44
instead of this saying live real-time updates it says the polling issue only then are we actually going to use the
9:28:50
polling great and now let's go ahead and let's just return all of that so return
9:28:56
data fetch next page has next page is fetching next page and Status like that
9:29:05
perfect uh great and it seems like we actually uh don't need the params inside let's
9:29:12
see yeah let's actually remove the perhaps we don't need the params and you can remove this import of grams my
9:29:18
apologies great and now let's go back to our chat messages
9:29:24
so components chat chat messages here and we can add that chat query here so
9:29:30
let's go ahead and write const object is equal use chat query from ad
9:29:38
slash hooks uh Slash use chat query like that go ahead and pass it the query T which
9:29:44
we have from our props the API URL the param key and the param value like that
9:29:50
and let's go ahead and let's extract the data the patch
9:29:56
next page function the has next page function a Boolean is fetching next page Boolean
9:30:05
and the overall status like this and let's just see I have this query key
9:30:11
which seems to be missing from here so let me just see what is up with that
9:30:17
okay so the query key is something we can generate from here so go above this and just write const query key open
9:30:24
backdicks like this and write chat colon chat ID
9:30:30
like that that is going to be our query key perfect and now that we have this
9:30:37
we can go ahead and render stuff according to this status right here so
9:30:43
I'm gonna go ahead and write if status is loading in that case you go ahead and
9:30:49
return a div with the class name of flex Flex Dash call Black slash one justify
9:30:57
Dash Center and item slash Center like that and inside I'm going to render a
9:31:03
loader 2 from Lucid react so make sure you add the Loader 2 from lucidreact and
9:31:08
let me move it there and let me separate these two as well okay and let's give this loader to a class
9:31:15
name of h-7w-7 text
9:31:20
sync-500 animate Dash spin and my Dash 4
9:31:25
like that and below that let's add a paragraph we're just going to say loading messages three dots like that
9:31:31
and the class name is going to be a text extra small text
9:31:38
sync 500 like that and dark mode is going to use text-sync 400 like that and
9:31:45
there we go you can see that now it's instantly loading our messages that's because we actually don't have uh this
9:31:50
API URL created yet perfect so now you can go ahead and copy this entire state
9:31:55
with loading and paste it below if status is equal to error in that case we
9:32:01
are not load we are not going to show this we're going to show the server crash from lucidreact so make sure you
9:32:07
have that imported and let's remove the animate spin class because we don't want our error to be spinning right and let's
9:32:15
just write something went wrong like that perfect and now let's just see I'm
9:32:22
pretty sure we're gonna get this error right now because our API route doesn't exist there we go so now it said for a
9:32:29
brief second it was shown an error and it said something went wrong perfect effect so what I want to do now is
9:32:37
actually create that API route so let's go inside of our app folder
9:32:43
make sure you save all of these files instead of the app folder API and create a new folder called messages like that
9:32:50
and inside create a new file route.cs so yes this is still inside of the app
9:32:55
folder because this is only for fetching the messages we can do that inside of app router great let's go ahead and
9:33:03
let's write an export asynchronous function get which has a request which
9:33:08
is a type of request like this let's go ahead and open a try and catch block
9:33:14
let's resolve the error and inside of this error let's go ahead
9:33:19
and write console log messages error sorry messages get like
9:33:28
that and pass in the error I mean it doesn't matter it's your error message right whatever it's easier for you to
9:33:33
find in the terminal and return new next response from next server internal error
9:33:38
with a status of 500 like that perfect and now let's go back
9:33:45
inside of our try block and let's get the current profile so profile is a weight current profile so not current
9:33:51
profile pages but current profile the old one we the Old Reliable one great
9:33:57
and now let's also import VB while we are here so our database usual perfect
9:34:04
and now let's go ahead and let's get the search for Rams so cons search params
9:34:09
are equal new URL requested URL like that
9:34:14
let's get the cursor so const cursor is equal to search
9:34:21
rams.get cursor const Channel ID is equal to search
9:34:27
params.get channel ID like that so cursor is going to be used to tell the
9:34:34
infinite load from what message to load the next batch of messages so there are
9:34:41
many types of querying and pagination and loading you can use the takes and
9:34:46
Skip method or you can use the cursor method for example and for infinite loading cursor I think is the preferred
9:34:53
method and it makes way more sense to me great so now if there is no profile let's go ahead and return new next
9:35:00
response unauthorized with a status of 401 like that great and
9:35:09
now let's copy and paste this and if there is no Channel ID
9:35:15
in that case next response is channel ID missing with a status of 400 like that
9:35:23
let me just expand my screen a bit okay and now let's go ahead and let's create
9:35:29
So Below this channel ID let messages to be a type of message from at Prisma
9:35:35
slash client like this let's move it to the top
9:35:40
and let's give it a default value sorry message an array and a default value of
9:35:45
one or array like that if we have a cursor that means that we can query from that cursor so messages is going to be a
9:35:53
weight DB Dot message dot find many like that and now we have to Define our
9:35:59
message batch so you can do whatever you want here I'm going to create a constant here called const messages underscore
9:36:06
batch so by default I'm going to fetch 10 by 10 so our my infinite load is
9:36:12
going to work 10 messages then I'm going to scroll to the top another 10 messages then another 10 messages you can Define
9:36:18
this to 50 if you want to or 100 right but for this tutorial I'm going to use 10 right so we see that effect uh great
9:36:25
so now that we have that if we have that cursor let's write the following we're going to take messages batch so we're
9:36:33
going to take those 10 we're going to skip one because we don't want it to
9:36:38
repeat the certain message that the cursor is at let's add the cursor so this is built in in Prisma ID is going
9:36:46
to be that cursor so we are going to start from that message that we passed from the infinite query on the front end
9:36:52
where Channel ID is channel ID or you can use the shorthand like that so
9:36:58
that's the param key that we are using from that use chat query and the channel ID value is the parent value and let's
9:37:06
include member of each of that message and let's also include
9:37:11
profile of each of that member so we can properly render that message
9:37:16
great and last thing let's order by created at descending like that because
9:37:23
we are going to do an infinite query which means that we are going to do reverse messages great that's if we have
9:37:29
a cursor but if we don't so else in that case we're gonna go ahead and write
9:37:35
messages message dot find many again
9:37:41
take messages batch like that where
9:37:46
Channel ID is equal to channel ID and we are going to include the members so no need to do
9:37:53
the cursor thing so remember include profile true like this and let's also order by
9:38:02
created at which is going to be descending because we are doing a
9:38:07
reverse loading of messages in an infinite load perfect let's go ahead and let's add let next cursor is going to be
9:38:15
no like that if messages that we managed to load so if
9:38:20
messages lost length is equal to messages batch like that in that case
9:38:25
next cursor is going to be messages messages batch so the last one from the
9:38:33
batch minus one dot ID so we're going to
9:38:38
create the next cursor for the next infinite load using the information of the currently fetched messages so if the
9:38:44
length of the new messages is 10 then we can pick the last one and get the ID but
9:38:49
if it happens that the messages length is lower than the messages match that means we reached the end of our infinite
9:38:58
load and no need to change the next cursor and that's going to tell the 10 stack react query that we've reached the
9:39:04
end and there is no next page great and let's go ahead and let's return a
9:39:09
nextresponse DOT Json like this items are going to be our messages and
9:39:16
next cursor is going to be the next cursor like this perfect so now we have
9:39:22
that and I think you can already try and refresh here and now there we go no more
9:39:27
errors it seems so let's go back to our chat messages now so components chat
9:39:33
chat messages component and what I want to do now is I actually want to show you
9:39:38
I like a very quick way to render these messages right here so below the chat
9:39:43
welcome go ahead and create a new div this div is going to have a class name
9:39:50
of flex Flex Dash call Dash reverse so this is very important it needs to be in
9:39:56
a reverse order and margin top Dash Auto like that and inside we're going to
9:40:02
render the data that comes from our use chat query like right here which uses
9:40:08
the infinite query inside so we are going to write data question mark dot
9:40:13
Pages question mark dot map like that we're going to get the first group of
9:40:18
messages let's also get their index go ahead and open this we're going to
9:40:24
render a fragment from react so make sure you import the fragment so we have to import the fragment I'm gonna I'm
9:40:30
just gonna move it to the top like this we have to import it in this way because we're gonna give it a key so give this
9:40:36
fragment a key of ID like that uh sorry a key of I my apologies like
9:40:46
that and inside we're gonna render group so this group that we have dot items.map
9:40:52
like that and this one is going to have a message and this message type is going to be a
9:40:59
message with member with profile so let's just quickly create that type so I'm going to go to the top and I'm going
9:41:05
to write type message with member with profile like that so that's going to be
9:41:11
a message from Prisma client make sure you add that message from the Prisma
9:41:17
client here extend it by ending end member
9:41:23
which is going to be a member from Prisma client we already have that and a
9:41:28
profile is going to be a profile from Prisma client so I have member message and profile from ad Prisma slash clients
9:41:37
so make sure to create this new type and then we can go back inside of iterating our group items here and we can assign
9:41:43
that to this message right here and let's go ahead now that we have that and we can now safely go ahead
9:41:50
and return a div and inside I'm gonna I'm gonna go and render
9:41:56
message dot content like that and let's give this a key off message dot ID like
9:42:03
this and there we go we can finally see our messages now so I'm gonna go ahead
9:42:09
and write new message here and I don't it's not going to be immediately transmitted here because we have not set
9:42:15
up our socket on the front end right so right now we still have to refresh but when I refresh right here there we go it
9:42:21
says new message right here and if you go to another Channel you can see that this is completely empty so this is a
9:42:28
new channel right which means that when I refresh here only then are we gonna see that perfect
9:42:35
so we are now ready uh to go ahead and style these messages and after that is
9:42:42
done we're gonna enable the socket i o on the front end so it's real time after that is done we are also gonna add
9:42:48
another hook which is going to control the scrolling of our application so when we get a new message we're gonna get we
9:42:53
want to get scrolled down but when we scroll up purposely to load new messages we don't want to get interrupted by that
9:43:00
so we're also going to do that great great job so we're finally seeing some messages and now we're going to build a
9:43:05
message item component so let's go ahead and let's style each
Chat Item component
9:43:11
of these messages right here so instead of using this div right here we are
9:43:17
going to render a chat item like this and when you save this you should get an
9:43:23
error because we don't have that component so let's go ahead and let's go inside of components chat and create a
9:43:31
new file chat Dash item dot TSX like this let's mark this as use client and
9:43:38
let's export cons chat uh item like that and return
9:43:44
a div same chat item like that go back into the chat messages and now you can
9:43:52
import chat item from dot slash chat item so the same way we did with welcome great and now you should have a
9:43:58
repeating chat item for as many times as messages you have in your database so
9:44:04
what I want to do is create an interface for the chat item props so let's go inside of the chat item and let's create
9:44:10
an interface check item props like that let's give it an ID of string a content of string a
9:44:19
member of type member from Prisma client so make sure you import that and each
9:44:24
member is going to have a profile of type profile from Prisma client as well we're gonna have a timestamp which is
9:44:32
going to be a string a file URL which is going to be either a string or a null
9:44:38
like this we're going to have a deleted prop which is going to be a Boolean a current
9:44:44
member prompt which is going to be a member from Prisma client so we already have it no need to import it twice all
9:44:51
right we have the current member and we're also going to have uh the is
9:44:57
updated prop to be Boolean like that and
9:45:02
the socket URL is going to be string like this and socket query
9:45:10
is going to be a record of string and a string like that perfect so now let's go
9:45:16
ahead and let's assign those props so I'm going to immediately assign the chat item props like that and now let's go
9:45:24
ahead and let's add all of those so we are going to have an ID we're going to
9:45:29
have a Content member timestamp like this let me just scroll a bit so you can
9:45:34
see I'm going to have timestamp file URL like this deleted like that current
9:45:40
member like that is updated socket URL and socket query like this
9:45:48
great now let's go back inside of the chat messages and let's go ahead and assign all of
9:45:56
those props here so go to the chat item here in the chat messages component and let's start by giving it a current
9:46:02
member of member let's also give it a key of message dot
9:46:10
ID like that let's give it an ID of message dot ID while we are here okay let's give it content of
9:46:17
message.content so let's just not misspell content like I did here all right
9:46:23
let's go ahead and let's write file URL to be message dot file URL like that
9:46:30
deleted is going to be message.deleted
9:46:35
all right timestamp is going to be format so we have to add a format from
9:46:41
date FNS so let's quickly go inside of our terminal I'm going to shut down my application and let's write npm install
9:46:47
date Dash FNS like this and we can immediately do npm run Dev on our
9:46:54
application now let's go ahead to the top and let's import
9:46:59
format whoops from date Dash FNS and let's create a
9:47:06
constant to define the date format so const date underscore format is going to
9:47:11
be D mmm yyy another y like that HH capital and M
9:47:19
like this great so just do it exactly like that and now let's go all the way
9:47:25
back to rendering of our chat item use format like that new date message dot
9:47:32
created at and use the date format like that perfect
9:47:37
now let's go ahead and add the is updated prop we're going to do that by comparing the message that is updated
9:47:44
sorry updated at is not equal the message dot created at so if they are
9:47:49
not equal obviously it was updated and let's say the socket URL which is going to be socket URL from the props we
9:47:56
have and socket query to be socket query from the URL that we have great and now
9:48:03
let's also alongside member give it uh alongside current member let's also give it a member
9:48:09
and for that we're going to do message dot member like this great so make sure
9:48:15
you have all of the props needed like this so you don't get any errors inside perfect now let's go back inside of the
9:48:22
chat item component and what we can do uh is we can already start uh rendering
9:48:28
it so let's go ahead and let's give this div a class name of
9:48:33
a relative group Plex blacks items Dash Center on the hover BG
9:48:41
Dash Black slash Five like that p-4 transition
9:48:47
and W Dash full like this okay and let me just refresh this so I know it's up
9:48:53
to date all right now inside of that let's go ahead and let's create another div
9:49:02
with a class name of group Flex Gap X-2 items Dash start
9:49:09
NW Dash full like this okay and now here create another div
9:49:17
the class name of cursor Dash pointer hover drop Dash Shadow Dash MD and
9:49:24
transition like that great and inside we're gonna go ahead and render the user
9:49:29
Avatar of the person who sent this message so import user avatar from DOTA
9:49:34
slash user Avatar or slash components user Avatar like that and I'm just going
9:49:40
to separate the two and let's give this a source of
9:49:45
member.profile.image URL like that so don't use the current member instead use the members of the person who sent the
9:49:52
message and now we can see my messages here great now let's go ahead outside of
9:49:59
this div holding the Avatar like that create a new div with the class name of
9:50:05
flex Flex call and W Dash full and inside create a new div
9:50:12
the class name of flex items Dash Center and GAP Dash X-2
9:50:17
like that and inside one more div
9:50:23
class name Plex items Dash Center like that
9:50:29
and in here we're going to create a paragraph we're just going to remember remember.profile.name like that and
9:50:36
let's go ahead and give this a class name of font semi bold text SM hover
9:50:43
underline like that and cursor Dash pointer
9:50:49
like that there we go uh great and now let's go below this paragraph and let's
9:50:56
add an action tooltip from dot dot slash action tooltip
9:51:01
so make sure you add slash components like that I mean you don't have to and inside for now I'm just going to render
9:51:08
a paragraph which says a roll and let's go ahead and let's give this little bit a label of member dot roll like that
9:51:16
so now when you hover over my role it's going to say admin like this if the
9:51:21
person who sent the message is actually an admin right if it's a moderator is going to say moderator so now let's
9:51:26
quickly replace this paragraph with an actual uh a proper component so in order
9:51:31
to do that let's create a role icon map So Below the interface outside of the chat item component create a const roll
9:51:39
icon map which is going to be well just an object
9:51:45
if we are a guest in that case null if we are a whoops let's not use a
9:51:51
semicolons but this if we are a moderator it's going to be oops
9:51:58
Shield check from Lucid react with the class name of W-4
9:52:05
w-40h4w-4 margin left to end text indigo-500 add a comma copy and paste
9:52:12
this and this one is going to be admin and instead of Shield check is going to be Shield alert from Lucid react so make
9:52:19
sure you have both Shield check and shield alert from lucidreact and I'm gonna separate those two and let's
9:52:25
change this to uh rows like that for the admin great and now that we have the
9:52:30
role icon app we can go all the way to the bottom and find this paragraph which says role
9:52:37
inside of this action tooltip and actually render the role icon map with member dot roll like this there we go
9:52:45
and now we can see next to my name that it says that I'm an admin perfect uh so let me just zoom out just a bit here so
9:52:52
it looks a bit better like that great now let's go outside of this div holding the action tooltip let's add a span and
9:52:59
inside we're going to render the time span timestamp like this and let's just
9:53:04
style it by giving it a class name of text that extra small text Dash sync-500
9:53:10
and on dark mode text sync 400 like that great now that we have that
9:53:17
let's go ahead and let's go outside of this div right here which holds the span
9:53:23
and what I want to do here now uh is just actually render uh the
9:53:30
content for now so let me just write content like this there we go so now you can see the content inside perfect so
9:53:38
before we continue uh I actually want to I want to create the cases for rendering
9:53:45
an image and a PDF right so let's go ahead and let's add
9:53:52
some constants here so I'm gonna go all the way to the top of the chat item here before the return function and let's go
9:53:59
ahead and let's write const so we're going to use a bunch of this constant is admin that's going to be current member dot
9:54:06
row is equal to member role which you can import from Prisma client so make sure you imported member role from
9:54:11
Prisma client so if current member is admin like that const is moderator it's
9:54:17
going to be current member that role equals member role dot
9:54:22
moderator like that Comes This owner so if we are the owner of this message then currentmember.id is
9:54:29
going to be equal to the member ID of the message like that and delete message
9:54:36
so const can delete a message is going
9:54:41
to be if it is not already deleted and Open brackets like this if we are an
9:54:48
admin or if we are a moderator or if we are an owner like this
9:54:56
so that's the candlelit message now const can edit message it's going to be
9:55:01
if it's not deleted like that and if is owner so only an owner can do can
9:55:09
edit the message right not even moderators or admins can do that that's not the practice even neither slack or
9:55:15
Discord follow right so we're just following them great and one more thing I want to add I also want to make sure
9:55:20
that it doesn't have a file URL so we shouldn't enable editing for PDFs or
9:55:26
messages or or image messages now let's write const is loading to be formed oops
9:55:32
we can do that yeah so we're going to have a form later let's do is PDF so file type
9:55:39
we don't have the file type yet okay let's go ahead and let's just quickly create a file type above everything here
9:55:45
so const file type is equal file URL question mark dot split binder dot dot
9:55:53
pop like that and now we have the file type so file type is equal to PDF and if
9:56:00
we have the file URL like that const this image is going to be if it's
9:56:06
not PDF and if we have a file URL great so I just wanted to add a bunch of this
9:56:12
constants here so that we can develop this easier perfect now let's go ahead
9:56:18
and let's find where we rendered our content right here right so out outside of here
9:56:23
and you can remove this content now and let's do an is image first so if it is an image let's go ahead and let's render
9:56:30
an href like this and let me just align this like that so
9:56:36
the href for this one is going to be the file URL so when the person Clicks in an image it's gonna get open for them
9:56:42
perfect let's give it a target of underscore blank let's give it a Rel uh
9:56:48
is it the real yes no opener no referrer
9:56:54
pretty fair like that okay and let's give it a class name of relative aspect
9:57:01
Dash Square like that we're also going to have rounded Dash MD
9:57:09
margin top of two overflow is going to be hidden it's going to have a border
9:57:14
it's gonna have a flex items Dash Center BG there's secondary like that and h-48
9:57:23
nw-48 like this so you can see that I sent one image message so now I have
9:57:28
this right here so if you don't just click on the plus icon and send a message as a as an image so make sure
9:57:34
that you do that so you can see what you're doing here great and inside I'm going to render an actual image from
9:57:40
next slash image so make sure you have imported image from next slash image let's go down to
9:57:47
it here okay find this image let's go ahead and let's give the image a source
9:57:53
of file URL let's give it an out of content let's give it a fill and let's
9:57:58
give it a class name of object Dash cover like this there we go now you can see the image that I sent as a file here
9:58:05
perfect now let's go ahead and let's do the same thing but for the PDFs right so I'm
9:58:12
gonna go ahead and write is PDF from the constants we made above create
9:58:19
a div with the class name here so what you can actually do to save some time we
9:58:24
can go inside of our components and find the file upload here right let
9:58:31
me zoom out a bit and find this one if value and file type is PDF in that case
9:58:37
this is what we're gonna have but we're just gonna remove this button right so
9:58:42
I'm going to copy that so make sure it's file and file type PDF so just copy this
9:58:47
if you don't want to copy it you can pause the video and see how it looks here like that okay and now what I'm
9:58:55
going to do let me see if I can expand my screen a bit more I can great so let me just
9:59:00
properly indent all of this now so it's PDF I'm just going to indent it like this I have to add the file icon from
9:59:07
lucidreact so make sure you have the file icon added okay the href in this case is going to be file URL like this
9:59:15
this can say the same and instead of rendering any value let's write PDF file so it looks nicer in a message and we're
9:59:22
not going to have this button at all like this there we go perfect so let me just zoom out for you
9:59:28
if you getting stuck here this is how you can do it so just this div with this class is a file icon which you have to
9:59:35
import from lucid and an href so I just copied it from file upload because it's exactly the same so for us to save some
9:59:42
time perfect and you can see how I have my PDF file here so it's shown like this and if I click on it it's going to open
9:59:48
perfect and now that we have that let's go ahead and let's just add some
9:59:55
use State Fields here so I'm going to go back to the top right here and let's add const is editing set is
10:00:03
editing we use state from react default value is false const
10:00:09
is deleting set is deleting like that use State balls
10:00:18
and make sure you have you state imported from react like this okay now that we have those two uh let's go back
10:00:26
after this is PDF right here and let's go ahead and
10:00:33
render if let me Zoom back in okay so if there is no file URL and if we are
10:00:41
not editing in that case go ahead and render a paragraph like that and let's go ahead
10:00:49
and just write the content inside like that there we go and now let's go ahead
10:00:55
and give this a class name like that which is going to be dynamic
10:01:00
so at CM from s slash lib utils so make sure you have this imported okay
10:01:06
in the first one it's going to have text SM text sync Dash is 600 like that and
10:01:13
on dark mode it's gonna have text sync 300 like that great let's see if that is
10:01:20
correct yes it is okay and if we are deleted so if deleted
10:01:26
in that case we're going to modify this style of it by using italic text Dash sync 500 and on dark mode is
10:01:34
going to be texting dash of 400 and it's going to be tax Dash extra small and
10:01:39
margin top of one like that so this is the entire Dynamic class name for the
10:01:45
content so if it's deleted we're going to make it italic we're going to make it an even more uh muted color we're gonna
10:01:51
make the text even smaller and we're just going to add a bit of a space from the top perfect so you're gonna see that
10:01:57
this in action when we actually enable deleting of that perfect and below this
10:02:02
content what I want to do is I want to write if is updated like
10:02:08
this and if it's not deleted in that case let's go and let's write a span
10:02:14
element like this and let's write just in parenthesis
10:02:20
edited like this so a little indicator that this message has been edited let's
10:02:25
give it the class name of text dash 10 pixels like that mx-2 text Dash sync 500
10:02:32
like that and on dark mode text search sync 400 like that perfect so you can't
10:02:38
really see neither the deleted or the edited but when we add those actions you're gonna see uh them working perfect
10:02:46
so now let's go ahead and find the end of this right here find the end of this
10:02:52
two divs like that and go ahead and open a conditional can delete message like
10:02:57
this if we can delete message go ahead and open a div like this
10:03:05
with a class name of hidden but on group hover it's going to be Flex items Dash
10:03:13
Center Gap Dash X-2 like that absolute
10:03:18
d-1 top Dash 2 sorry minus top Dash 2 like this right dash 5 BG Dash white
10:03:26
button dark BG is going to be sync 800 like this we're going to highlight
10:03:33
border and a rounded Dash SM like this so let's see if you can already see that
10:03:38
there we go when I hover on my message since I am the owner of this message you can see that a small little dot appears
10:03:45
right so we're going to turn this into our actions to edit and delete the message
10:03:51
great so now let's go uh inside of that and inside what I want to do is first
10:03:58
open another conditional can edit message so if I can edit message only then am I going to render this action
10:04:05
tooltip which we already have which is going to have a label
10:04:10
of edit like that and inside what I'm going to do is add an edit icon from
10:04:17
Lucid react so make sure you import that like this edit file icon Shield alert
10:04:23
and shield check make sure you have all of those okay and inside of this I'm gonna go ahead
10:04:29
and give this a class name of cursor
10:04:36
Dash pointer ml-auto W-4 H dash 4 like that
10:04:43
I'm also going to have it textlash sync Dash 500 however text
10:04:50
sync-600 on dark on Hover it's going to be texting 300 and
10:04:57
transition like this great so let's see now you can see that now I have a nice
10:05:03
little edit button here so let me go ahead and expand this you can see when I hover on my message since I can edit it
10:05:09
I have a nice little button here right and let's go ahead and switch to light mode there we go you can see it looks
10:05:16
nice even uh in light mode perfect so let's go ahead and let's continue
10:05:21
developing by adding the delete option so this one is going to be very similar
10:05:26
but you can go ahead and copy this just place it outside of the can edit message conditional like this and let me just
10:05:33
align this indentation instead of edit it's going to be delete and instead of the edit
10:05:40
trash from Lucid react like that there we go so make sure you have imported the trash
10:05:47
icon and now let's see and we should have there we go now we have the delete
10:05:53
function here and in here we have both edit and delete so you can see how for the PDF file I'm not having the edit
10:05:59
option same thing for the image but for the text message I can edit and delete it perfect so we can now edit that what
10:06:06
I want to do now is that when we click on edit this turns into an input that
10:06:12
which can modify and then send the request to the database so let's go ahead and let's find the
10:06:19
scan edit message right here and on this edit on click go ahead and call an arrow
10:06:25
function which calls set is editing to True like this great and now let's go
10:06:32
ahead and let's import everything we need from the form and everything we need from the other components great so
10:06:39
inside of right here go ahead and import from add slash components slash UI form
10:06:46
like this import the form form control form field and form item like that
10:06:54
let's also go ahead and let's import everything as Z from Zod like that and
10:07:02
let's import axios from axios let's import Qs from query Dash string
10:07:09
because we're going to need both of those to create some requests let's import use form from react hook form
10:07:15
like that and let's import Zod resolver from add hook form slash resolvers slash
10:07:23
Zod great now let's go ahead and create our form schema so I'm gonna go below the roll icon map
10:07:30
here and write const form schema is going to be Z dot object
10:07:36
content Z dot string with a minimum value of 1. whoops like this
10:07:42
great now that we have that let's go ahead and let's create our form so I'm
10:07:48
gonna go inside of my chat item here and I'm gonna go right here and write
10:07:55
const form is equal to use form right here let's go ahead and let's give it a
10:08:00
type of Z dot info type of form schema like that let's add a resolver the Zod resolver
10:08:08
form schema and let's go ahead and let's write default values content to be
10:08:14
content like that great now let's go ahead and let's write a quick use effect
10:08:20
from react so make sure you import the use effect from react let me just show you here there we go and in here all I'm
10:08:28
going to do is phone.reset content to be content like that and it's
10:08:33
going to trigger on any content change so this is going to make sense when we enable real-time message updating when
10:08:39
we receive new information here let's immediately reset that form if the user tries to edit a message again so that
10:08:46
when we click is editing we don't actually show the previous message all right and now that we have that
10:08:55
um let's go ahead and let's import a couple of more components here so I'm going to import input from dot slash UI
10:09:01
input but I'm going to rename that slash components like that and I'm also going to import button from DOTA slash UI
10:09:09
button but I'm going to change it to this great now what we have to do is we
10:09:16
have to go and find where our general content rendering is so this one right
10:09:23
with is updated and not deleted and this design right here and this conditional
10:09:29
if it's not file URL and if it's not is editing then we render that great so go
10:09:36
just below that and what you're going to do here is right if there is no file URL and if
10:09:45
is editing like that in that case let's go ahead and let's add our form element
10:09:51
which we imported let's pass in everything from the form inside like that let's open the native
10:09:58
form elements like this let's give it an on submit for now form dot handle submit
10:10:05
and let's create our owns on submit now so I'm going to go to the top here just above all of this stuff so right here
10:10:13
comes on submit is going to be just a very simple values we're going to add the type later
10:10:20
so console log values like that okay and
10:10:26
let's use this on submit back here so pass in that on submit all right and
10:10:32
let's go ahead and let's give this form a class name
10:10:37
which is going to be Flex items Dash Center W Dash full Gap Dash
10:10:45
X-2 like that npt-2 like that great inside of the form
10:10:50
go ahead and render the single form field which is a self-closing tag and we already have it imported the control is
10:10:57
going to be form dot control like that name is going to be content like this
10:11:02
and render is going to be a function which immediately destructures the field and it returns
10:11:09
a form item like that give the form item a class name of flex-1
10:11:16
like that inside use the form control like that and let's just fix the
10:11:22
indentation okay and inside we create a div with a class name of a relative
10:11:28
MW Dash full like this great and finally let's add our input here
10:11:35
let's give it a class name prop so we're going to add p dash to
10:11:41
bg-think-200 90 on dark mode it's going to be vg-sync Dash 700 slash 75 like
10:11:49
that border Dash none border Dash zero Focus slash visible Dash sorry colon
10:11:57
ring Dash zero like that and let's also give it a focus slash visible
10:12:03
ring Dash offset-0 like that backslash sync-600 and on dark mode text sync 200
10:12:13
like that great and on the placeholder we're gonna write edited message like
10:12:20
that and let's also go ahead and spread the field just like that perfect so
10:12:26
let's see if we can already see that if I press on edit here there we go you can
10:12:31
see how this turns into a nice input where I can write whatever I want great and what I want to do now is just a
10:12:40
button next to it as well as a little text instructions on how to cancel if
10:12:46
person accidentally clicked on that right so find the end of this form field right here
10:12:52
but still inside of this native HTML form element and add the button which we imported and write save let's go ahead
10:13:00
and let's give it a size of small and the variant whoops of primary
10:13:08
like that great and outside of the form let's go ahead and let's create a span
10:13:13
which is going to say press escape to cancel like that enter to save
10:13:21
and let's give it the class name of text Dash open square brackets 10 pixels so a
10:13:27
very small text margin top 1 and text sync 400 like that perfect so let's try
10:13:34
this out now if I go and click edit on the message there we go I have the save button and I
10:13:41
have the little span telling me press escape to cancel and enter to save perfect so let's go ahead and let's
10:13:47
trigger this escape to cancel functionality right here right uh I'm gonna go all the way to the top
10:13:55
and I'm gonna create a new use effect here so we can do it before anything
10:14:01
here use of image it doesn't matter let's go ahead now
10:14:06
right here and let's write const handle key down
10:14:12
event let's give it the type of any for now if event dot key is equal to escape
10:14:19
whoops like that or event dot key code is equal
10:14:26
to 27 set is editing is pulse like that
10:14:32
perfect and now let's add window.ad event listener
10:14:38
key down to be handled key down like that and
10:14:44
return window dot remove event listener
10:14:49
G down like that handle G down just like that perfect and I'm just
10:14:57
going to replace this with double quotes just to be consistent and now if I try
10:15:02
and like click on something and click Escape you can see how it immediately cancels that entire thing perfect so
10:15:09
what I want to do now is an actual on submit that when I change something and save I want it to
10:15:15
be uh sent to the server perfect so the way we're gonna do that
10:15:20
is we're going to go ahead and create a proper on submit function so let's find our on submit function right here and
10:15:26
let's go ahead and change these values to be a type of Z dot infer and pass in the form type of form schema
10:15:35
like that and let's make it an asynchronous function let's go ahead and let's open a try and
10:15:42
catch block and let's log the error like that
10:15:47
perfect let's also extract const is loading from the form.form state that is
10:15:52
submitting and before we forget let's use this is loading
10:15:58
and find our editing find our form here let's give the disabled property the
10:16:04
input if we are loading and let's also give the disabled property the button if we are loading
10:16:10
like this great and now let's go back uh well where am I okay let's go back
10:16:17
inside of this on submit function here what I want to do here is write const URL to be Qs which we have imported
10:16:24
stringify URL like that and go ahead and write URL
10:16:31
open macdix socket URL slash ID like that and query
10:16:40
is going to be socket query like that perfect and now let's just write a
10:16:47
weight axios dot patch URL and values
10:16:52
perfect so now we have that which means that if I go ahead and try so I'm just
10:16:58
going to zoom out a bit and open my inspect element here and if I try editing a message to try
10:17:04
and edit any message you have so edited message I should get a 404 not found
10:17:10
perfect so that's exactly what I wanted let's go ahead and let's create that route now
10:17:16
so let's go ahead I'm going to close this inspect elements and I'm just going to collapse
10:17:22
everything here okay and I'm make sure you save all of those files go inside of
10:17:27
your pages go inside of your API socket right here and let's go ahead and let's
10:17:34
create a new folder called messages like this go inside of
10:17:41
that folder and create a new file
10:17:47
message ID dot TS like that
10:17:52
and now what's going to happen is that we have this message that TS files and this messages folder so what we have to
10:17:59
do is drag and drop this message as the Tes file into the folder like this and
10:18:04
just go ahead and rename it to index.thes right so that's going to hold
10:18:09
the slash messages and just to confirm everything is still working go ahead and try and create a new message so a new
10:18:15
message like this let's see if it's gonna work let's refresh and I should have two new
10:18:22
messages now so there we go new message one and this one sent right now great so
10:18:27
now let's go ahead inside of this newly created messages message in message id.ds right
10:18:36
here and let's go ahead and let's actually resolve updating and deleting our message so
10:18:43
export default asynchronous function Handler like that it's going to take the
10:18:49
request which is next API request from next and a response which is next API uh
10:18:55
response server i o from our uh special types like that and let's just separate
10:19:01
it too perfect now inside let's go ahead and first let's limit the route methods because we are doing this in the pages
10:19:07
API so if request that method is not delete like that
10:19:13
and if request that method is not equal to patch in that case return
10:19:21
response.status405.json with an error of method not allowed like that great now
10:19:29
let's go ahead and let's open a try and catch block let's go ahead and let's console log the
10:19:36
error message ID like that and an error like
10:19:41
that and let's just go ahead and return a 500 error
10:19:48
internal error great now let's go ahead and let's get
10:19:54
our profile but for the pages so const profile is equal await current profile
10:20:00
pages so make sure you import that one and pass in the request so make sure you
10:20:05
have this import great let's go ahead and let's get the message ID
10:20:10
server ID and channel ID whoops from react.query
10:20:18
like that and let's extract the content from the request dot body like that
10:20:26
perfect let's go ahead and let's write if there is no profile we can go ahead and just return
10:20:34
401 unauthorized
10:20:40
great now let's go ahead and copy and paste this if there is no server ID
10:20:46
we're going to say server ID missing with a status of 400 and let's go ahead
10:20:54
and do that again but for the channel ID saying Channel ID missing great now
10:21:01
let's go ahead and let's attempt to fetch the server so let's add our DB util so import DB from s slash libdb
10:21:09
and let's write cones the server is equal to weight db.server dot find first like that
10:21:18
where ID is server ID as string whoops members some raw file ID
10:21:28
profile dot ID like that and let's include the members like that great and
10:21:36
you can just copy this one more time paste it here if there is no server
10:21:41
404 with an error server not found like
10:21:46
that great now let's go ahead and let's attempt uh to find
10:21:51
let's attempt to find the message right sorry the channel so cons channel is
10:21:57
equal to wait db.channel dot Point first where
10:22:04
ID is channel ID as string and server ID is server ID as string
10:22:11
like that great and that's enough for the channel and you can go ahead and
10:22:16
copy and paste this and just slightly modify it instead of looking for the server this one is for
10:22:23
the channel saying Channel not found great now let's go ahead and let's attempt to get the individual member so
10:22:30
const member is equal to server dot members dot find get the member like
10:22:35
that and member.profile ID is matching the profile that we are in dot ID like
10:22:43
that if there is no member you can go ahead and return another 404
10:22:49
error saying that member not found perfect now let's go ahead and let's uh
10:22:57
find the message so let message is equal to wait
10:23:03
db.message.find first like that where ID is message ID as string Channel ID is
10:23:13
channel ID as string and let's also include
10:23:19
the member and let's also include the members profile by setting the profile
10:23:25
to True like that perfect now I'm just going to copy this one more time like
10:23:30
that and inside I'm gonna say if there is no message or if message has been deleted
10:23:37
in that case let's go ahead and write a404 message not found right great now let's
10:23:44
go ahead and let's create some constants here so const is message owner message
10:23:51
dot member ID is equal to the current member dot ID close this admin member.roll is equal to
10:23:59
member role let's import that from at Prisma slash climb so don't forget to do
10:24:04
this and I'm just going to move it to the top like that if membrill.admin like that const is
10:24:11
moderator is member dot row is equal to member role dot moderator like that and
10:24:19
const can modify is going to be is message owner or is admin or is
10:24:26
moderator like that great and let's immediately do an error here if we
10:24:32
cannot modify this message so if can modify with an exclamation point at the
10:24:39
beginning it's going to be a 401 and we are unauthorized
10:24:44
to do this action great and now let's go ahead and write if the method is a
10:24:50
deleting method so if Red Dot method is delete in that case message is going to be
10:24:57
awaitdb Dot message let's just not misspell this so message is going to be awaited DB Dot message
10:25:04
whoops dot update remember we are doing a soft delete
10:25:10
right so where ID is message ID as string like that and
10:25:17
data and now we're going to reset file URL content and we're going to change
10:25:22
the deleted so file URL is null the content will change from this to
10:25:28
this message has been deleted like that and deleted is gonna become
10:25:35
true perfect and let's also uh let's just not misspell this so deleted like
10:25:41
that and of course let's include Our member and let's include their raw file like
10:25:49
that perfect great job now let's go ahead and we can copy this entire thing right
10:25:56
so if request method delete let's go ahead and copy that here and change this one the request method is hatch so if we
10:26:03
are updating let's also do just one quick uh change here inside right if we
10:26:09
are not the message owner in that case return response dot status 401.json and an error
10:26:17
unauthorized right so only the owner of the message can do this right and is message owner
10:26:26
like that even if a moderator or an admin tries they can still not do that so only the message owner can edit their
10:26:33
own message right so db.message.update right here this is
10:26:38
correct instead we're not going to change file URL we're not going to change the content we're gonna
10:26:44
do the content change using that variable so this is the same thing as writing content which we extracted from
10:26:50
the request body and make sure to include the member and to include the profile perfect and now go outside of
10:26:57
this if clause and write const update key backticks chat
10:27:03
Channel ID like that column messages column update like that
10:27:10
and response question mark socket question mark server question mark IO
10:27:16
oops server question mark IO question mark emit update key and the
10:27:25
updated order deleted message and return response dot status 200.json message like that perfect so
10:27:34
now let's go ahead and let's try this so I'm gonna refresh this and I'm going to open my inspect
10:27:39
element here so I'm just gonna delete everything that comes here I'm gonna attempt to update this from
10:27:47
the test to this is an edited message let's click
10:27:52
save and let's see if we're going to get any errors or if it's going to work all right uh ignore this this is because we
10:28:00
don't have an appropriate connection um to from from the front and yet okay let's see I didn't get any 404s let's
10:28:07
see if I refresh will that say this is an edited message and there we go look at it it says this is an edited message
10:28:13
and look at the little edited sign right here great great job so it officially
10:28:18
Works uh one more thing that I just want to do is after we finish updating this so let
10:28:25
me just close everything here and let's go back uh inside of the chat item so go
10:28:31
inside of components chat chat item right here on submit so after it
10:28:36
successfully submits do a form dot reset and do set is editing back to false like
10:28:43
that perfect so now I'm gonna try again let's do the latest one I'm gonna change
10:28:49
this to this is a completely edited message I'm going to save and if it's
10:28:56
successful there we go so I'm going to refresh this
10:29:02
and there we go it's here this is a completely edited message so you can ignore that it disappeared we're gonna handle that using sockets and other
10:29:09
things great great job so far so now we have to create the delete functionality
Delete Message
10:29:15
so let's go ahead and let's create the functionality that when we click on this delete trash icon we actually have a
10:29:22
model for that so let's go ahead and let's head inside of our uh hooks use a
10:29:29
model store right here and we have to add what I'm pretty sure is the last
10:29:34
Model in this tutorial which is going to be the delete message model so add a pipe and delete message like this and we
10:29:43
don't have to add anything here what we are going to use is the API URL and the query perfect so let's go ahead and
10:29:50
let's find something similar so components models right here we have the delete channel model so how about we use
10:29:58
that I'm going to copy that and I'm going to paste it and rename that to delete
10:30:03
Dash message Dash model dot TSX like this let's rename that file and just
10:30:08
make sure you are in the new one so it's going to be delete message model and change the is model open to
10:30:17
delete message like this great and we're gonna leave it for here
10:30:23
for now let's go inside of components models whoops uh providers model
10:30:29
provider right here and just add the last one delete message model like that and make sure
10:30:36
you've imported it and as always I'm gonna change this to slash components perfect and now let's go ahead and let's
10:30:44
head back into components chat chat item right here and I think I've prepared
10:30:50
some is deleting here but actually we're not gonna need it so I got ahead of myself so you can remove the ease
10:30:55
deleting here and instead what we're gonna add is our use model so let's go
10:31:00
ahead and add const on open Chrome use model which you can
10:31:06
import from add slash hooks use model store so make sure you add this there we go now let's go ahead and let's call
10:31:13
this on open when we press on the trash icon so let's go all the way down above
10:31:19
everything and there we go so we have a non-click for our editing but for on our own trash we're gonna have on click
10:31:26
which is going to call an arrow function called the on open call the delete message model and the data it's going to
10:31:34
be uh API URL which is going to be a combination of our socket URL so open
10:31:41
back ticks and write socket URL slash ID like that and we're going to pass in
10:31:48
the query which is going to be the socket query like that perfect so I think we can already try it out if I
10:31:54
click on a delete it should open the deletes Channel perfect so let's now
10:32:00
keep it open and let's slowly modify it so it does what we want for the delete message let's go inside of the
10:32:06
components models delete message model right here and first things first let's
10:32:12
just rename it so instead of the title delete channel it's going to be delete message
10:32:18
the are you sure you want to do this can stay and we're just going to modify this well nothing special after the break
10:32:26
virgins we're just gonna write the message will be permanently deleted like
10:32:33
that there we go everything else in my opinion can stay exactly as it is but we
10:32:39
just have to modify the on click function before we do that let's go ahead and
10:32:45
let's extract something from our use model data here so we are no longer working with the server and the channel instead we are working with API URL and
10:32:53
the query like that so then we can go ahead and remove
10:32:58
everything inside of this URL sorry inside of this stringify URL options and let's change them to use the
10:33:05
URL which is API URL which will be structured from the data which comes from the use model and whoops I scrolled
10:33:12
a bit too far and let's just add a pipe pipe empty string and let's pass in the
10:33:19
query like that and then we have the await access delete URL after that we
10:33:24
have the on close like that and there is pretty much nothing else we have to do so we can completely remove those two
10:33:31
and let's see if that prompts us to remove anything else yes we don't need this so we can remove that and that
10:33:37
means we can also remove the import for that right here great and I'm pretty sure that this should already be working
10:33:44
that's because this API URL which comes from our chat item so let's see how we Define that we call the socket URL slash
10:33:51
ID let's check out our Channel page so Channel ID page to see what that is
10:33:58
so our API URL sorry our socket URL is slash API socket slash messages and we
10:34:04
have the channel ID and the server ID and we combined the socket URL with the
10:34:10
ID of that chat so it's going to be slash API slash socket slash messages that message ID and then that is going
10:34:17
to go inside of our Pages folder API socket messages message ID and if you
10:34:23
remember we created both the patch function and we also handled the delete function because they are very similar
10:34:30
so let's see if we are courageous enough to do this I'm just going to click confirm I don't even know what message I
10:34:35
selected but since it's loading thus far I I'm there we go it says this message
10:34:41
has been deleted so you might be wondering how come this was in real time well that's because remember we have a
10:34:46
10 stack react query which falls back to polling if our websocket fails for a
10:34:53
split second it failed and then it up updated my message with polling perfect so this means that we have officially
10:34:59
finished uh deleting messages so let's try the latest one I'm gonna delete the latest message I'm going to click
10:35:05
confirm okay and I'm going to refresh
10:35:10
and there we go this message has been deleted and I can no longer do any actions on it perfect amazing amazing
10:35:18
job what we are going to do now is we're gonna add a hook which is going to connect to the socket IO and watch for
10:35:24
all of these events so take a look at the events we need to handle inside of this folder API socket we have to watch
10:35:31
for when we receive a new message using this channel key so chat Channel ID messages so we have to watch for that
10:35:38
and we have to watch for individual updating of a message so either delete or uh edit both of them are going to use
10:35:47
the same key because it's technically updating both of them perfect so we are gonna do that next
Chat Socket hook
10:35:53
so one thing I want to do before we get onto the socket thing I wanted to do
10:35:58
that when I click on a specific name from my message or their Avatar I want
10:36:03
to get redirected to that member so let's go ahead and let's go back inside of our
10:36:09
components inside of the chat and go ahead and find the chat item component right here
10:36:16
what I want you to do is to import two packages so sorry two items so use
10:36:24
router and use params from next slash navigation like that and then what I
10:36:31
want you to do is go ahead inside of your chat item component and just create
10:36:36
a new function const on member click like this and let's go ahead and check
10:36:43
if member has clicked on themselves so if member dot ID is equal and let's just
10:36:49
do a proper Arrow function so if remember is this correct member dot ID is equal
10:36:56
to currentmember.ie in that case we can just return and break the function
10:37:01
otherwise let's go ahead and let's add the params use params outside const
10:37:07
router is equal to use router so we have both of those imported and now let's use them here by saying router.push open
10:37:15
backdicks slash servers slash Rams question mark dot server ID slash
10:37:23
conversations slash member dot ID like this there we
10:37:31
go and now let's go ahead and let's use this on member click in two places so the first one is going to be in this div
10:37:38
right here which holds our Avatar so when I click on here on click I want to
10:37:44
call the on member click and I want the same thing to happen when I click on this paragraph which holds the member
10:37:50
profile name like this great so now if you go ahead and let's refresh this
10:37:57
and let's try if I go and click so I send some messages from another user here and I suggest that you do that it's
10:38:04
a log out and just log back in and just send some messages so your chat has some content and I'm gonna click here and all
10:38:12
right I made a mistake here so let's see uh what exactly went wrong here
10:38:18
alright so the mistake is inside of my own member click function
10:38:23
let's go ahead and find it so it should be slash servers not slash server like
10:38:30
that so let's now go back and let's see if that will fix it so if I click on another user here I should get
10:38:36
redirected to our one-on-one conversation there we go so just like that and if I try and click on myself
10:38:44
nothing should happen perfect now what I want to do is something that I've just
10:38:50
noticed now is happening and I thought they were going to resolve it later is this error that we have right here
10:38:57
regarding web sockets so it says that there is a websocket breaking here right and I've managed to debug where it's
10:39:05
happening so if you take a look at the terminal so if you don't have that okay if you don't
10:39:11
have an error you can just continue but I have this very specific error that ends with UND error in a lead argument
10:39:18
right it's very specific and I couldn't really figure out why it's happening and
10:39:23
then I figured it out so we're going to do step by step if you're having this exact error so if
10:39:30
you're not having this error in the console right you can also test by sending a message so I'm just going to
10:39:35
send a random message like this and you can see that when I send a message for a
10:39:41
brief second I get another error so if that's not happening to you that means your websocket is working correctly it
10:39:48
looks like between the time that I finished my clone and between right now
10:39:53
where I'm developing this next 13 made an upgrade which broke my implementation
10:39:58
for some reason but don't worry even if we don't implement websockets we can
10:40:04
always just ignore them and add polling so first things first I'm gonna show you how to do that and then we're gonna fix
10:40:10
the sockets by downgrading I'm gonna show you how to do that so how to do it with the react query go
10:40:17
inside of hooks right here go inside of use chat query and what you can do here
10:40:23
is just hard code this to a thousand the refetch interval right so every second
10:40:29
you're going to refetch and let me show you right now how that is going to look like so I think you can already go ahead
10:40:36
and say okay this is a new message and once this is submitted after a
10:40:43
second there we go a new messages here let's try and edit this so I'm gonna say
10:40:48
this is a edited message let's save this and again after a second
10:40:55
it says this is an edited message let's try and delete it
10:41:01
and same thing after a second this message has been deleted so you can see that this actually works pretty well
10:41:07
right so even if you don't manage to fix this issue that I'm gonna show you how to fix now you can always just do your
10:41:14
refetch interval inside of your use chat query to a fixed every second polling
10:41:19
great now turn it back to this is connected we don't use falling otherwise
10:41:24
we do so what I'm going to do is I'm gonna go inside of my next dot config.js
10:41:32
to fix this socket i o issue right here and I'm gonna go inside and write
10:41:38
webpack like this and and it's not really an object it's a
10:41:45
function so get the config go ahead and write config.externals.push
10:41:53
and write utf-8 Dash validate
10:42:00
common JS UDF Dash 8-validate like that and let's also
10:42:07
write buffer util okay buffer util like this to be common
10:42:13
JS buffer util like that okay and before
10:42:18
you start your application what we are going to do is you are going to go inside of package Json and go ahead and
10:42:25
find your next version so my next version is 13.4.19 and this one seems to be
10:42:32
problematic for some reason so what I'm going to do is I'm going to change this
10:42:37
version to next 13.4.12 right here and I'm gonna do the
10:42:45
same thing for sland config next just so they match my version so excellent config next to
10:42:51
13.4.12 and next to 13.4.12 right here and I'm gonna go
10:42:57
ahead and I'm going to shut down my application and I'm going to run npm
10:43:03
install like this so I'm going to install all of my packages and that's going to pick up that newer version
10:43:09
inside that I've just changed right if I knew this at the beginning I would have told you to do the npx create next app
10:43:17
using that version but I did not expect this to happen all right and now let's do npm run Dev
10:43:24
and you're gonna get a couple of these warnings and yeah okay I forgot to do one thing so we get an error here
10:43:30
let's go back inside of inside of next config here and I forgot
10:43:36
to return the config so after you extend uh push something to it go ahead and return the config like that great and
10:43:43
you don't have to change anything so what we did in the package Json is fine and let's try again after we added that
10:43:49
so npm install I'm just gonna do it just in case okay and npm run Dev again great
10:43:56
so I just did a small mistake in next config.json I forgot to write return config great now that this is here let's
10:44:05
go ahead and refresh now and it seems like we no longer have that weird uh
10:44:13
error that I was showing you from before look at this no errors just compiling you and so it's definitely due to the
10:44:19
next 13 version and you can also take a look and let's try and send the message
10:44:24
now so I'm just gonna write test socket trigger let's see if that's going to trigger a
10:44:30
socket error and it seems to not have triggered any error so yes it's not loading here in real time because we
10:44:36
don't have that setup but no errors that's exactly what I wanted great let's
10:44:41
go ahead now and let's create a hook which is actually going to load this messages in real time using sockets in
10:44:48
the next 13.4.12 version because obviously the newer one is not working I'm sorry for
10:44:54
that but I could not have known that would happen great let's go now uh inside of our Hooks and let's go ahead
10:45:01
and create a new hook called use Dash chat socket.ts like this
10:45:07
and let's go ahead and let's write type chat socket props
10:45:13
like this it's going to have an add key which is a string an update key
10:45:19
which is also a string and it's gonna have a query key which is also going to
10:45:24
be a string now let's go ahead and write export const
10:45:30
whoops use chat socket and inside Let's uh
10:45:35
immediately destructure the add key the update key and the query key like that
10:45:41
and let's do chat socket whoops chat socket props like that and return an
10:45:47
arrow function let's extract the socket from our provider using the use socket
10:45:53
Hook from the providers folder like that so make sure you have this imported
10:45:59
okay and let's add the query client from use Query client
10:46:05
like this make sure you import that from 10 stack query all right and now let's go ahead and
10:46:12
let's open our use effect here so use effect from react make sure you add this import
10:46:18
right here and let me just move it with this one and let's go ahead
10:46:24
and let's just add an empty array here and let's just quickly go
10:46:30
and create one type that we are going to need here so type message with
10:46:36
member with profile it's going to be a message which comes from at Prisma slash client
10:46:44
so make sure you import that I'm just gonna move it here so it's going to be a message
10:46:49
which has sorry which has a member
10:46:54
so import member from Prisma client and that member has a profile
10:47:01
like this there we go so just make sure you have this three imported and you added this type perfect so now let's go
10:47:08
back uh inside of our use effect and first one we're gonna do
10:47:13
a check if there is no socket so very quickly if there is no socket in that case you can just break the
10:47:21
function no need to go further alright and now let's create a socket method to
10:47:27
update the message in real time so either delete it or edit it so socket on update key
10:47:33
gets gives us a message and that message is a type of message with member with
10:47:39
profile like that and inside we're going to call the query client
10:47:45
and we're going to set query data inside the query key
10:47:52
we're gonna get the old data which is a type of any and we are going to use that
10:47:57
old data to iterate all all the pages and find the matching message using the ID and replace it inside of that data so
10:48:05
first let's do a check if our old data is not enough to update so if there is
10:48:10
no all the data at all or if there are no old data.pages or
10:48:17
if old data.pages.length is equal to zero we
10:48:22
can just return old data like that perfect let's go ahead and write const
10:48:28
new data to be old data.pages.map get individual page which is a type of
10:48:34
any and return spread the page inside and now let's get
10:48:40
the items to be page.items.nap get individual item which is message with
10:48:47
member with profile like that and go ahead and write if item.id is
10:48:56
equal to message.id which we received from the socket that means okay we found
10:49:01
what message to replace so return the new message from the socket instead and
10:49:07
for all others leave them as it is perfect so we finish that socket let's
10:49:12
see where it ends okay it ends right here perfect but we are actually not done we
10:49:20
have to return this new data so let's just go ahead and find the end of this
10:49:25
new data block right here and go ahead and write return
10:49:31
and just spread all the data inside and pages is the new data like this perfect
10:49:39
and now let's go ahead and let's write another socket action which is going to
10:49:45
watch for new messages so socket.on add key
10:49:50
message a type of message with member with profile like that query client dot set query
10:49:58
data using the query key like this all the data which is a type of any
10:50:06
if there is no old data or if we don't have old data.pages or if all
10:50:15
data.pages.length is equal to zero in that case return pages
10:50:22
open an array and a single object inside with items and that new message inside
10:50:27
of an array great go outside of this if clause and then cons new data and spread
10:50:34
all the data.pages inside like that and then just focus on the first page so new
10:50:40
data 0 is equal to all the new data inside so new data zero items
10:50:49
and we are going to add inside of that sorry the items is an array
10:50:55
like that so add the new message to the top and spread new data
10:51:00
dot items inside like that great and then you can go ahead and just simply
10:51:07
write return an object called Data Pages new data like that perfect
10:51:16
so just go ahead and close this stuff great and then let's go ahead
10:51:22
and let's just write the return function to call socket of add key and socket of
10:51:30
update key like that great and let's pass in the query client in the dependencies array
10:51:37
let's pass in the add key the query whoops add key the query key
10:51:44
socket and the update key as well there we go great now let's go back inside of
10:51:51
our chat messages so save this file if you think you've made a mistake you can always copy it
10:51:56
from my GitHub and let's go inside of the app folder sorry inside of components chat chat
10:52:04
messages and right below the use chat query let's add the new use chat socket
10:52:11
from add slash hooks use chat socket so I imported that right here great let's
10:52:18
go ahead now and let's add the necessary keys inside so we need the query key we need the add
10:52:26
key and we need the update key like this we don't have the add key and update key
10:52:32
so let's quickly create them at the top here so const add key
10:52:37
open backticks chat
10:52:43
chat ID like that and messages const update key
10:52:50
chat chat ID and messages and update like
10:52:57
that right and this needs to be the same as in your pages folder socket folder
10:53:05
messages folder so the index is for adding messages so chat ID messages and
10:53:12
for deleting and updating it's chat ID messages update so just make sure those
10:53:18
match chat ID messages for adding and chat ID messages update for updating so
10:53:24
let's go ahead and let's see if this will work in real time now so I'm going to create a new channel
10:53:30
test socket just so it's completely clear right so you don't have any other messages inside I'm going inside of that
10:53:37
newly created Channel and I'll write okay test socket in real time let me just zoom in
10:53:43
and if I paste this let's see if that is going to work and there we go it seems
10:53:48
to work in real time so it's definitely due to the next 13 version I again I'm sorry because of that now let's go ahead
10:53:56
and let's try and editing it so edit in real time let's save the file let's see if our
10:54:02
other Hook is working it does edit in real time is working and let's try deleting in real time so I'm gonna
10:54:08
confirm this message and there we go so it all works perfectly so what did we do
10:54:15
how did we fix that little error we had with the websockets let's look at all of our changed files so in the next
10:54:21
config.js well this is useless okay so in the next config.js we added a webpack
10:54:29
config fixing those errors in the console that we have adding this to and
10:54:34
returning the config we forgot that so we couldn't start our application and
10:54:39
one other important thing we did was inside of the package Json so we
10:54:45
downgraded from next 13.4.19 or whatever version your will be when you're watching this video all the
10:54:52
way to 13.4.12 right but as I've mentioned if
10:54:57
you did not have any error in your version I don't know what it might be when you're watching this video it could
10:55:03
be that they fixed the issue and I'm sure they will they are a great team and they always listen to their customers
10:55:08
but you know we are all developers and sometimes we make mistakes even in production so we downgraded to this safe
10:55:15
version and then we finished our hook and we just tested every functionality
10:55:20
and it seems to work so great great job what we have to do now
10:55:25
is we have to add functionalities for our scroll right and we also had to add
10:55:30
a functionality that when we scroll up it loads older messages so let's go
10:55:36
ahead and let's do that now so now let's go ahead and let's wrap up
Chat Scroll hook
10:55:41
our chat messages component by adding the scroll functionalities right because
10:55:46
right now there is no way for us to load new messages and we do batches of 10
10:55:51
messages so let's go ahead and let's go inside of components chat chat
10:55:59
messages right here and let's go ahead and let's add use ref from react so
10:56:04
alongside fragment go ahead and add use ref and element ref so those two right
10:56:11
here and now let's go ahead and Below these Keys let's go ahead and
10:56:17
let's add const chat graph to be user ref give it a type of element
10:56:24
ref open pointed brackets and write a div like this
10:56:30
and a default value of no and you can go ahead and copy that and do the same
10:56:35
thing for bottom ref so it's also going to be a div great and now let's go ahead
10:56:42
and let's assign this chat ref all the way here to this first div in
10:56:48
the return function so this main return function not the error or loading so find the main return function and give
10:56:54
the ref of chat ref to this one right here perfect and go ahead all the way
10:57:02
down and before the end add a new div which is a self-closing tag and give it
10:57:09
a new ref which is going to be bottom ref like this perfect and before we create our
10:57:17
use scroll hook let's go ahead and let's just use some of these items which we
10:57:23
got from the chat query fetch next page has next page and is fetching next page
10:57:29
so let's go ahead and let's render this conditionally so if we don't have a next
10:57:35
page in that case in that case only do you
10:57:41
render this div class Flex right here in this case go ahead and write has if
10:57:48
if we Sorry if we don't have next page in that case in that case only also
10:57:54
render the chat welcome like that so we don't want always uh to have this
10:58:00
chat welcome right we only want to have it if we are on the last page and we know if we're on the last page if there
10:58:05
is nothing more to load if we've come to the top then we can display this space which pushes everything right see how it
10:58:13
looks now see because we have more than 10 messages here so at the top I'm not
10:58:18
rendering that big space and the chat welcome only when I scroll up and load messages older than this do I want to
10:58:25
show that chat welcome screen because it means okay we've come to the beginning of the conversation great and now below
10:58:32
this let's go ahead and let's add a new condition as next page so if we have
10:58:38
next page to load let's go ahead and add a div here with the class name of flex
10:58:44
justify Dash Center and let's go ahead and add a conditional is fetching next page so if we are
10:58:52
fetching the next page we're going to add a little loader at the top so Loader 2 icon I think we should already have
10:58:58
that imported from Lucid react yes we already used it great let's give it a class name of h-6 and w-6 text sync Dash
10:59:09
500 animate Dash spin and my-4 and now
10:59:15
let's go ahead and do the other thing if we don't add a button which is going to say load previous messages like that
10:59:23
and let's go ahead and let's give this button a class name
10:59:28
of text sync 500 hover text sync-600 dark text
10:59:36
sync Dash 400 attacks extra small m y Dash 4 dark hover text sync 300 and
10:59:47
transition like that great so let's go ahead and let me refresh my
10:59:53
application to see if everything is working all right okay it seems like uh something has
10:59:59
broken but there we go I just refreshed and now you can see if you send more than 10 messages here so go ahead and
11:00:04
spam your chat and you should see this button to load previous messages right and now let's add an on click to that
11:00:10
button so add on click to call a narrow function fetch next page
11:00:18
like that perfect so now I think it should already work if you try it's
11:00:24
loading and there we go and now it loaded the welcome to General and everything else and you can see in a
11:00:30
completely smaller Channel we load the test socket right here so
11:00:36
this sorry we load the welcome screen at the beginning and this space but if we send more than 10 messages then we have
11:00:42
this load previous messages button and you can see I added a lot of messages here so it took me three Clicks in order
11:00:49
to get to the top perfect now let's try to automate that by adding a chat scroll
11:00:55
hook so let's go ahead inside of our Hooks and create a new file use Dash
11:01:01
chat Dash scroll dot DS like that and let's go ahead and let's write a type
11:01:06
let me zoom in chat scroll props it's going to be chat ref
11:01:13
chat ref which is react.ref object
11:01:18
HTML div element like that we're also going to have a bottom ref
11:01:26
like that should load more which is a Boolean load more which is going to be a
11:01:33
function and a count which is going to be a number like that and now let's go ahead and Export const use chat scroll
11:01:40
like that let's extract this so chatraf bottom wrap should load more and count
11:01:48
and let's go ahead and let's assign those so this should be a function so go ahead and wrap this in parentheses like
11:01:55
that and then assign chat scroll props like that there we go and let's go ahead
11:02:02
and add const initialized set has initialized to be used state
11:02:08
from react so make sure you add that import and give it a default value of false let's also import use effect from
11:02:14
react so use effect and use state from react and let's go ahead and open an arrow function here with an empty
11:02:21
dependency array for now and inside let's get the top div so const top div
11:02:27
is equal to top sorry to chat ref question mark dot current like that and
11:02:34
then let's write the handle scroll so const handle scroll like this const
11:02:40
scroll top is equal top div question mark scroll top if scroll top is 0 and should load more
11:02:50
so if we scrolled all the way to the top and there is more to load let's go and immediately load more so no need to did
11:02:59
I add the function I didn't I also have the function load more I didn't add it here so just add it to the props load
11:03:05
more like this there we go so if we manually scroll to the top immediately scroll more perfect and now let's just
11:03:12
add that listener so let's go ahead here and add top
11:03:19
top div question mark dot add event listener like that scroll handle scroll
11:03:26
like that and let's do a return pop the question mark out remove event
11:03:32
listener scroll handle scroll
11:03:37
like that great so that's for uh scrolling manually to the top and let's
11:03:43
give it a should load more dependency load more and chat rat dependency and now let's
11:03:49
create another use effect which is going to get triggered when we get a new message so we know to scroll to the bottom use effect again
11:04:00
and let's go ahead and get the bottom div so const bottom div is equal to bottom ref
11:04:06
question mark dot current constop div is equal to chat ref.current
11:04:14
cons should auto scroll is going to be a function
11:04:19
if we have not initialized so if not hash initialized and if
11:04:26
we have a button div set has initialized to true
11:04:32
and return true like that otherwise if we can't get the top div so if there is
11:04:39
no top there go ahead and return pulse like that and
11:04:44
now let's calculate the distance from the bottom and if we are not too far from the bottom of the chat then
11:04:50
whenever we get a new message we can scroll the user all the way down but if the user uh forcefully goes up to load
11:04:57
new messages no point in scrolling the user down and interrupting their search so const distance
11:05:04
from bottom is top div dot scroll height minus stop
11:05:10
give dot scroll top minus top div dot client
11:05:17
byte like that and return distance from
11:05:22
bottom is less or equal than 100 like that and then let's go ahead and let's
11:05:28
write so let me just see if I finish this correctly okay this can be indented can
11:05:35
it no okay like this and now let's write if should whoops if should auto scroll and execute that
11:05:44
function set timeout like this
11:05:51
bottom ref dot current question mark scroll into View Behavior
11:05:59
smooth like that and let's give the timeout 100 milliseconds and let's add
11:06:07
the bottom breath the chat ref count and has initialized to this use effect great
11:06:13
so we have that now now let's go ahead back inside of our
11:06:18
chat messages and below the use chat socket add use
11:06:24
chat scroll from add slash hooks use chat scroll so we just created that hook
11:06:29
great and go ahead and pass the chat ref
11:06:35
go ahead and pass the bottom ref the load more which is going to be fetch next page which we have from this chat
11:06:42
query here should load more is going to be if we are not fetching more if we're not
11:06:49
fetching the next page F if we have the next page by turning this into a Boolean
11:06:54
using double exclamation points as next page and account which is gonna just
11:07:00
count the latest page so data dot pages first one
11:07:05
dot items dot length
11:07:11
and if we can't get any of that default to zero like this so make sure to use these question marks just so they always
11:07:18
trigger so they don't accidentally break the app sorry okay and now let's try I'm
11:07:24
gonna try and say new message and I should automatically get scrolled down
11:07:31
there we go you can see how my screen automatically scroll down and now I'm going to refresh here and I'm going to
11:07:37
try to load messages manually by scrolling up so if I scroll up there we go it's loading if I scroll a bit down
11:07:42
and load more it's loading newer and I can do that all the way to the top perfect so depending if user can
11:07:49
manually scroll we are going to trigger the auto scroll and if we use it for some reason cannot scroll
11:07:56
so let's let's test this in this one I have a lot of messages here so if for some reason users Scrolls at the top and
11:08:03
then it's stuck like this they can always click manually to load previous messages great so you
11:08:10
completely wrapped up the chat messages component what we have to do now is we have to enable them for the individual
11:08:16
one-on-one member conversation which is going to be easy because we have everything completed now we just have to
11:08:22
create the API routes for it and then we're gonna finish it up with a live audio and video calls
Direct Messages
11:08:29
so now let's go ahead and let's enable one-on-one conversation so let's go back
11:08:35
inside of our main folder inside of routes server server ID any
11:08:42
set of channels go ahead to the individual member ID page right here so far we've only put the chat header but
11:08:50
now we can add the chat messages from ad slash components chat chat messages and
11:08:55
we can add the chat input from chat slash components chat chat input so just
11:09:00
make sure you have both of those chat messages and chat inputs I'm just gonna move this to the top so chat header chat
11:09:07
messages and chat input now let's go ahead and let's give them all appropriate props so for the chat
11:09:12
messages let's give the member of current member like that let's give the
11:09:18
name of other member.profile.name like that chat ID of
11:09:23
conversation dot ID type of conversation
11:09:28
API URL to slash API slash direct slash message Dash messages like this
11:09:36
Ram key is going to be conversation ID ramp value is going to be conversation
11:09:42
dot ID socket URL is going to be slash API slash socket slash direct Dash messages
11:09:50
like this and socket query is going to be an object which takes in the
11:09:55
conversation ID and which is type of conversation dot ID like this great and
11:10:01
now for the chat input go ahead and give it a name of other member dot profile
11:10:07
dot name like that let's go ahead and give it a type of conversation
11:10:13
API URL of Slash API slash socket slash
11:10:18
direct Dash messages like that and query
11:10:23
of conversation ID conversation ID conversation dot ID like
11:10:33
that and if you save those now you should also see messages here but our
11:10:39
request is going to fail that's because we don't have this route slash API
11:10:45
socket direct messages and slash API slash direct messages you can see the error something went wrong so let's go
11:10:51
ahead and Implement those now so first let's do the global slash API
11:10:57
slash direct messages just to load the messages let's go ahead let's close everything let's go inside
11:11:04
of the app folder inside of the API folder and create a new folder called
11:11:09
direct Dash messages like that and inside you can just copy the route from
11:11:15
messages because they're very similar we're just going to have to change a couple of things inside so everything
11:11:21
says the same messages batch stay the same we are doing the cursor the channel ID all of that is correct but our let
11:11:29
message array is not going to be message but direct message from at Prisma slash client so make sure to import that and
11:11:35
you can already remove the message from Prisma client all right and now instead of looking at awaitdb.message we're
11:11:42
looking at db.directmessage this time and instead of using a channel ID here we're gonna
11:11:49
have to use conversation ID so instead of loading the channel let's go ahead
11:11:54
sorry instead of loading the channel ID we are loading the conversation ID so
11:12:00
change this param to be conversation ID like that and do the check for
11:12:06
conversation ID and conversation ID is missing and then we can safely use the
11:12:11
conversation ID right here perfect let's scroll down and let's do the same change this one is going to be direct message
11:12:18
like that and this is going to be the conversation ID like that perfect and
11:12:24
everything else can say the same and let's just change this to direct messages get so we know something goes
11:12:30
wrong here so why does this change to conversation ID well because in our main
11:12:36
folder routes conversations member ID page we set the param key to be conversation ID and the socket queries
11:12:43
conversation ID so that's what we are working with here so let's go ahead and refresh this now
11:12:49
and there we go no more errors but our chat is still not going to work we have
11:12:55
to fix that now so now let's create that route that is going to allow us to create direct
11:13:01
messages so let's go ahead and close everything and go inside of the pages folder
11:13:07
and you can go inside of the socket folder and create a new folder direct
11:13:12
Dash messages like this and inside you can copy the index.ds so just paste it
11:13:19
from messages like this and now we are going to modify it to match uh the direct messages instead of just messages
11:13:26
so first thing that we're going to change is this uh request.query we are
11:13:32
not going to work with server ID and channel ID instead we are just going to work with conversation ID like that
11:13:37
which means that we can only check this conversation ID the right conversation ID is missing and remove the check for
11:13:44
channel ID like that and instead of looking for Server here we are going to look for the conversation so you can go
11:13:51
ahead here and remove This const Server like that and let's go ahead
11:13:56
and we can actually also remove the channel so all the way so remove both the check for channel the
11:14:03
remove the check for Server all of these things so just leave the member after the content check right here and we're
11:14:10
gonna get our conversations from the our members from the conversation so let's
11:14:15
go ahead now and let's write const let me Zoom back in conversation is equal to await
11:14:22
db.conversation dot find first like that where
11:14:28
ID is conversation ID as string like that or open an array
11:14:35
number one raw file ID is equal to profile.id of the currently logged in user so like
11:14:42
that or the other option is that we are member too so either Member One or
11:14:48
member 2 has to have our matching profile ID which we get right here using the
11:14:55
current profile pages right so after we get that let's go ahead and
11:15:00
add include and let's go ahead and let's include the member one and let's include their
11:15:08
profile so true and you can go ahead and copy this
11:15:13
and just rename this to member two like this perfect and now before we do the
11:15:20
members let's do if there is no conversation in that case we can return this error 404 conversation not found
11:15:30
like this let me just expand my screen as much as I can there we go and now we're gonna use a different method to
11:15:37
find the member so we're going to write the conversation dot Member One Dot profile ID
11:15:43
is equal to current profile dot ID if that is true then we are
11:15:49
Member One so let's assign ourselves to conversation dot member one otherwise we
11:15:54
are member two so conversation dot member to like that perfect and we can
11:16:01
leave this as it is and instead of creating a message we are right now creating a direct message right which
11:16:09
means we are no longer using the channel ID but the conversation ID
11:16:14
like that and everything else is the same because those two models are very similar and last thing we have to change
11:16:20
is this channel key to use conversation ID instead and let's just change this to
11:16:25
direct messages post like that so let's go ahead now and let's try this so I assume this is
11:16:32
still not uh going to work real time but after I refresh I think the message should be visible so this is a direct
11:16:38
message let's go ahead it seems like we've got an error here it seems to be a
11:16:44
404 error all right let's go ahead and let's check out what that is
11:16:50
so we have slash API socket direct messages here and what I forgot was to
11:16:55
add so messages is spelled with two s's and I named my folder with one s
11:17:01
messages like that okay let's try now so this is a direct message I'm going to
11:17:07
press enter and there we go now it's disabled for a longer time here and there we go this is a direct message
11:17:14
perfect so you can see that yeah it actually works in real time because this one
11:17:19
sends the proper uh rest socket server i o Channel key right and we already have
11:17:24
all of that set up so you see how useful that was that we first finished the entire chat messages perfect again if
11:17:30
you're not using sockets you should see your message anyway after one second because of that refresh refresh in the
11:17:37
rule that we have great what's not working now is editing the messages and deleting them so let's do that
11:17:44
so let's go back uh inside of our folder uh right here
11:17:49
and let's expand this a little bit and you can just copy this message ID and
11:17:55
paste it here in the direct messages and let's go ahead and let's rename that to
11:18:00
direct message ID like this great so go inside of that file right now and let's
11:18:07
modify it so it fits uh the message ID and conversation structure so we are no
11:18:13
longer looking for message ID server ID and channel ID from the query instead we are looking for direct message ID
11:18:19
because that's what we named our file direct message ID and we're looking for the conversation ID because that is the
11:18:26
param key that we are sending the content stays the same and we can just check for the conversation ID here and
11:18:33
change this to conversation ID is missing and go ahead and remove this check no need for it and now we can go
11:18:40
ahead and remove this server and this channel so just leave the member like we
11:18:45
did in that previous one and let's go ahead and let's find a the conversation instead so const conversation is equal
11:18:54
let me zoom in is equal to awaitdb.conversation dot find first like
11:19:00
that where ID is conversation ID as string
11:19:07
or open an array remember one profile ID
11:19:12
is equal to currentprofile.id or it's member two so the second item in Array
11:19:18
is member two like that so we are either that one or the other one after the
11:19:24
where Clause let's add the include Clause so Member One and their profile
11:19:34
and same thing for the member too so let's go ahead and add that member to profile there we go and now
11:19:43
let's go ahead and let's copy this check for member and reuse it for the conversation so if we didn't find the
11:19:50
conversation then just write conversation not found like that and now let's go ahead and modify how we find
11:19:56
the member so conversation dot Member One dot profile ID is equal to profile dot
11:20:03
ID in that case we are conversation.member one
11:20:09
otherwise we are conversation DOT number two like that this can stay the same and now
11:20:17
for the messages let's go ahead and change this to let direct message I'll
11:20:23
wait direct message that fine first where is going to use the direct message
11:20:29
ID and it's going to use the conversation ID conversation ID like
11:20:34
that and the rest can stay the same if there is no direct message or if direct message has been deleted in
11:20:43
that case message has not been found perfect and let's change this to use
11:20:49
direct message that member ID as well the rest can stay the same now let's go in the delete method right here so
11:20:56
delete method is going to use the direct message constant and look for db.directmessage ID is going to be
11:21:04
direct message ID and there we go the rest can stay the same and the same
11:21:09
thing is going to be for the patch so if we're going to change from message constant to direct message constant
11:21:15
awaitdb dot direct message and it's going to use the direct message ID like
11:21:22
that and inside of here we're going to use conversation dot ID and we're going to pass in the direct message here and
11:21:30
the direct message to the Json right here perfect let's go ahead and let's try that out now so I'm going to refresh
11:21:36
this and let's try and edit these messages in real time so
11:21:42
edited direct message and let's save it
11:21:47
let's see if it works there we go in real time and let's delete this one once
11:21:52
I delete it let's see there we go all in real time perfect so you have completely
11:21:58
finished all the messages now what we have to do is add the video and voice
11:22:04
channels so now let's go ahead and let's enable video chats so what I'm going to do is
Video Calls
11:22:10
I'm going to visit livekid.io so this is open source and has a very generous free tier and you
11:22:18
can also self-host it if you want to so I think this is the absolute best option
11:22:23
for real-time video audio and data let's go ahead and let's click on the cloud
11:22:28
right here once you're in the cloud go ahead and click get started for free and go ahead
11:22:35
and create an account once you are inside go ahead and accept terms of service just like this and
11:22:42
let's name the app so I'm going to name it Discord tutorial like that and continue
11:22:48
let's wait a second for this to load and go ahead and just answer these
11:22:53
questions right here great once you're in the cloud here let's go ahead and let's prepare our DOT
11:23:00
environment file so we can add the environment variables needed so I'm going to go here and I'm going to add
11:23:06
live kit underscore API underscore key I'm going to add live kit
11:23:12
underscore API underscore secret and next underscore public underscore live
11:23:19
kit underscore URL like that and let's go ahead and fill each of those so first
11:23:24
thing we can already fill is the next public live kit URL what you have to do is once you've logged in and you are
11:23:30
inside of this dashboard you can see this URL right here so just click copy websocket URL at the top and go ahead
11:23:38
and paste it here like that great now let's go ahead and let's go inside of
11:23:44
settings here and go ahead and click on add a new keyer go ahead and give it a description
11:23:52
so I'm going to call it tutorial and click generate like that and don't close
11:23:57
this window copy the API key and paste it in live kit underscore API underscore
11:24:02
key and copy the secret key and go ahead and paste that into live git API secret
11:24:09
like that great so now that you have that you can go and
11:24:14
visit live kit documentation so you can safely close this now if you accidentally close it before you were
11:24:20
able to paste it just click add a new key great now let's go ahead and click on the documentation button here and
11:24:26
let's follow the documentation for next 13 right here so we are let's first do
11:24:32
the installation of live kit SDK right here so I'm going to copy this and I'm going to show you in my terminal how
11:24:39
that looks so let's go inside of the terminal here I'm going to close my app
11:24:45
and there we go let's just okay so it's this one it's
11:24:51
npm install live kit server Dash SDK live kit Dash client and live kit slash
11:24:58
components Dash react and live kit slash components Dash Styles like that so let
11:25:04
me zoom out so you can see this in one line if possible like this so you can
11:25:09
just copy it from their documentation of course just select the npm so it's step one under next 13 documentation
11:25:17
and go ahead and press enter and wait for all of those to install
11:25:22
great once that has installed let's go ahead and let's follow the Step 2 which
11:25:28
we already did we added all of this uh API keys inside so no need to do that
11:25:33
what we have to do now is create a token endpoint so let's go ahead and do that I'm gonna go here and I'm gonna go
11:25:41
inside of my app inside of my API folder so let me just zoom in a bit and I'm
11:25:46
going to create a new folder called live kit so create a new folder inside of your app API called live kit like that
11:25:54
and go ahead and add a new file route.cs inside like that and you can go ahead
11:26:00
and copy this entire snippet and paste it here I am of course going to expand this so if you don't want to copy from
11:26:06
there you can copy from mine right here so there we go pause the screen and you can copy this entire thing but we do
11:26:13
have to change a couple of stuff so first things first uh this is fine
11:26:19
this is fine but our API key API secret are also fine but the vs URL is not
11:26:25
instead of this one it's going to be next underscore public underscore
11:26:30
live kit underscore URL like that perfect and everything else can stay the
11:26:36
same so why did this need to change well because in our DOT environment file as you can see we are using the next next
11:26:41
public live kit URL so just make sure all of those three keys match what you
11:26:46
use here so secret and API key like that perfect one now that this is done we can
11:26:54
create our component which is going to join the actual video call so let's go ahead and let's go inside of
11:27:02
our components folder and create a new file called
11:27:08
media-room.tsx like that go ahead and Mark this as use client like that go
11:27:14
ahead and import use effect and use state from react go ahead and
11:27:20
import live kit room video conference
11:27:28
from ads live kit slash components Dash react like that and
11:27:35
import at live kit slash component Styles like this go ahead and import channel from
11:27:42
Prisma client go ahead and import use user from Clerk
11:27:48
nexjs go ahead and import Loader 2 from Lucid
11:27:53
react like that now let's create an interface media room props to have a
11:27:59
chat ID which is a stream a video which is a Boolean and audio which is a
11:28:05
Boolean as well great now let's write export const media room
11:28:12
and let's extract all of those so chat ID video and audio and let's map them to
11:28:18
the props media room props like that perfect so let's return this Arrow function and let's go ahead and let's
11:28:25
get the user so user Chrome use user which we imported from Clerk and let's
11:28:31
create a state for token and set token from use state like that now let's create a use effect
11:28:38
here which is going to call our newly created live kit route and append the
11:28:44
token inside of this state so if there is no user first name or if there is no
11:28:50
user last name we can return the function and now let's generate the name constant using
11:28:56
backticks so open an object user.firstname space user.last name like
11:29:02
that so that's going to be written when you join the room now let's go ahead and add a
11:29:08
self-executing function so go ahead and open parenthesis and write asynchronous
11:29:13
function like this go ahead and open a try and catch block
11:29:22
in the catch we are just going to lock the error like that and in the try block write
11:29:30
const response is equal to a weight a fetch open back takes slash API slash live kit
11:29:39
question mark room is equal to open a special object chat ID
11:29:44
and username is equal to the name so every channel is
11:29:51
going to be a have its own chat ID so that's why we're gonna be able to that easily generate unique video rooms for
11:29:58
every channel and for every direct message great let's get the data cons data is equal to await response dot Json
11:30:06
like that set token data data.token like that perfect and now
11:30:14
let's go ahead and give this a dependency array a user question mark
11:30:19
first name user question mark last name and chat ID like that great now let's go
11:30:26
ahead and render if token is empty which means we are still
11:30:31
fetching the token so let's return a div with the class name of flex Flex Dash
11:30:37
call plex-1 justify Dash Center and items Dash Center like that and inside add a
11:30:45
loader too which we imported which is a self-closing tag and give it a class name of
11:30:51
h-7w-7 like that text sync 500 animate
11:30:58
whoops animate Spin and ny-4 like that and the paragraph which says loading
11:31:05
with three dots like that and let's give the paragraph a class name of tax Dash
11:31:10
extra small text sync 500 and on dark mode text search sync 400 like that
11:31:17
great and finally if everything is working fine return a live kit room like
11:31:24
that which is a self-closing tag my apologies it's not a self-closing tag so
11:31:30
go ahead and render video conference inside like that give it a data Dash LK Dash
11:31:39
theme of default give it a server URL of
11:31:44
process.environment.next underscore public underscore live kit underscore URL
11:31:49
make sure that matches your environment file a token of token a connect of true
11:31:56
a video of video and audio of audio
11:32:02
like that perfect and now we're ready to render this inside of Channel ID page
11:32:08
so now let's go inside of our Channel ID page inside of app main routes uh
11:32:16
channels Channel ID right here and let's dynamically render these messages in
11:32:21
this chat input so we're only going to render that if Channel type is text so go ahead and add a conditional
11:32:28
channel.type is equal to channel type and import that from Prisma client so
11:32:33
make sure you add this import I'm gonna move it to the Top If it's equal to channel type dot text only then are we
11:32:40
going to render a fragment like that and go ahead and copy the chat messages and the chat input like that and paste it
11:32:47
inside there we go and also just indent it so it looks nice great and outside go
11:32:54
ahead and add if Channel type is equal to channel type
11:33:02
dot audio in that case we're going to render a media room like this
11:33:09
we're going to pass in the chat ID of channel.id and the video of false and an
11:33:16
audio of true like that great and let's import media room from add slash
11:33:22
components media room so let's not forget that okay and let's copy and paste this and do the
11:33:30
same thing for video but this time video is going to be true like that perfect so
11:33:35
let's try this out now I'm going inside of my application here yeah also make sure you run your application so let me
11:33:42
just go ahead and npm run Dev and let's go ahead now and let's go
11:33:49
ahead and create a video channel so I'm going to call this video Dash test and
11:33:54
give it a type of video and click create right here all right and let's see if video test is
11:34:02
working all right it seems to be loading I'm going to wait a couple of seconds and
11:34:08
then I'm gonna check for errors all right so the reason we are stuck in infinite load is very simple so we have
11:34:15
to go inside of components inside of the media room and inside of this
11:34:22
asynchronous function I forgot to execute it so go at the end of the brackets inside of the use effect at the
11:34:28
asynchronous function and just execute it at the end like this let's go ahead
11:34:33
and refresh this and there we go now we can see a room being loaded here and
11:34:38
let's see if this is going to go smoothly there we go you can see my name here you can see that I'm talking and you can finally see me perfect and let's
11:34:46
go ahead and try the audio room and there we go the camera is off here
11:34:51
perfect so now you can see me here on the camera one thing that we have to do
11:34:56
now is enable this for direct one-on-one communication with users
11:35:01
so now let's go ahead and let's create one of the last components
11:35:06
inside of our components folder here so go inside of the app folder sorry
11:35:14
components chat and in here create a chat Dash video Dash button.tsx
11:35:19
component let's go ahead and Mark this as use client like that
11:35:25
let's go ahead and import Qs from query Dash string
11:35:30
like that let's import use path name from next navigation use router and use
11:35:36
search params like that let's import video and video off
11:35:43
from Lucid react and let's import action tooltip from dot dot slash action
11:35:50
tooltip and I'm just going to change that to slash components like that perfect and now let's export const chat
11:35:57
video button like that and let's go ahead and let's return an
11:36:04
action tooltip give it a side of bottom like that label
11:36:10
of tooltip label like that and inside render it button with an icon
11:36:18
like this so let's go ahead and Define this stuff now so const icon is going to
11:36:23
be is video in that case it's going to be video off otherwise video like that
11:36:29
and cons tool tip label is gonna be is video and video call
11:36:36
otherwise start video call like that now let's get this so const
11:36:43
uh is video is equal to search params dot get video like that and add a
11:36:49
question mark between search params and let's get the search for ends now so can't search
11:36:55
Rams is equal to use search params like that cons path name is equal to use path
11:37:01
name once router is equal to use router like that so add those three great and now
11:37:09
you have the const video great you have the icon rename this to Capital icon so
11:37:15
that you can render it great and let's go ahead and let's add an on click function here so const on click
11:37:22
once URL is equal to Qs the stringify url url is going to be path name
11:37:29
or an empty string like that and the query is going to be video is video
11:37:35
undefined otherwise true and add an option to skip now true like that
11:37:43
perfect and then let's go ahead and let's edit this a little bit so go ahead
11:37:49
and give this icon a class name of h-6w-6 backslash sync-500 dark Dexter sync-400
11:37:59
and go ahead and give this button an on click
11:38:04
on clicked like that and the class name of hover Dash
11:38:09
opacity-75 and transition and mr-4 like that
11:38:14
so now let's go ahead and save this file and go back inside of the chat header
11:38:20
component and go all the way down where it says the socket indicator and before
11:38:25
the socket indicator added type is equal to conversation in that case go
11:38:31
ahead and add chat video button like that and make sure you import it from
11:38:37
dot chat video button like that there we go and now if you go into inside one and
11:38:45
one conversation inside of your chat header right here you should see a video
11:38:50
call button and when you click on it it should append a video true here so let's
11:38:56
go ahead and let's see uh why that is not working for me so I'm just going to refresh I'm going to click again
11:39:04
okay let's go ahead and debug that so it's very simple so I was in chat
11:39:09
header I got back to chat video button it's because I don't use this URL so let's go ahead and write router.push URL
11:39:16
like that and let's try now if I click let's refresh first
11:39:24
ah there we go so when I click for you can see that video is appended in my URL when I click it's off so now let's do
11:39:30
the functionality which actually shows the media room so let's go back inside of our member ID
11:39:36
page so I'm just gonna go and expand this and go inside of app main routes
11:39:42
conversation member ID page so let me just expand so you can see where that is go back to the props right here and add
11:39:50
search params here which are gonna have a video optional Boolean
11:39:57
like that and go ahead and extract the search programs from here as well and now go back inside of the render
11:40:04
function and let's go ahead and leave the chat header but let's keep this only if
11:40:10
search Rams dot video so put exclamation points so if there is no video in search params only then go ahead and render a
11:40:18
fragment with chat messages and chat input so select two of these like that
11:40:25
and paste them inside and just go ahead and indent those perfect
11:40:31
and there we go so that solves that now and now let's go ahead above that and
11:40:36
add a different query so if search programs.video is true then go ahead and render the media room
11:40:44
from components media room so make sure you import the media room like I did here and give it a chat ID of
11:40:53
conversation.id and video of true and audio of Truth like that there we go
11:41:01
let's go ahead and try I'm going to refresh here and once I click on the
11:41:07
video call right here you should be able to see me right here
11:41:13
on the camera because we have a one-on-one conversation perfect and if I end the video call we are off great
11:41:19
great job you finish the entire Discord clone uh I'm not sure if I have time to
11:41:25
show you the deployment if not I'm gonna write in the comments how to do it or I'm gonna make an additional video if I
11:41:30
do I'm gonna recheck my total time and then I'm gonna create another part nevertheless thank you so much for
11:41:37
watching this entire video and I hope to see you in the next one if this is the end of the video thank you so much and
11:41:44
great great job so it looks like I have some time to show you how to deploy after all so
Deployment
11:41:50
let's go ahead and let's close everything so I'm just going to zoom out I'm gonna close everything here go
11:41:57
inside of your terminal right here shut down the application and do git add
11:42:03
get commit final okay so I already committed but I just wanted to show you
11:42:09
that you do this as well and now let's go ahead and create our GitHub repository
11:42:14
alright so I opened the new repository template here inside of my account and let's name this something like theme
11:42:20
there's chat Dash tutorial like that let's make it private and click create
11:42:26
Repository go ahead and choose the second option
11:42:32
which is push an existing repository from the command line and let's paste all of that here so just
11:42:37
make sure you did git add and git commit like that and now go ahead and visit
11:42:43
railway.com so we cannot deploy to Virtual because versal is serverless and we're using websockets meaning that web
11:42:49
sockets will not work there so go ahead and create an account or log in so you have a free tier which doesn't
11:42:56
require a credit card go ahead and click on new project and click deploy from GitHub repo right here and now you might
11:43:05
have to click configure GitHub app if it's not loading your repository so I'm going to search for mine what did I
11:43:12
named it team chat so find your repository which you just created here
11:43:18
and let's go ahead and let's add variables right here so we have to add variables select that and go ahead and
11:43:26
press on this little icon so we can add more of them at once actually uh
11:43:32
oh yeah click done raw editor right here there we go like that and now let's go
11:43:38
ahead and open your dot environment file and copy everything that is inside and paste it right here like that perfect
11:43:45
and you can actually remove this huge comment from Prisma so no need for that so just leave the environment variables
11:43:51
like that and go ahead and click update variables like that and then you can go
11:43:57
to your deployments and there we go it's building so let's just wait a couple of
11:44:02
seconds to see if maybe we will have to rebuild there we go so mine automatically started so let's wait
11:44:07
until uh one of this finishes great so my deployment was successful
11:44:13
and now what I have to do is Click add a domain right so click on that build and
11:44:19
click add a domain and there we go now you have a domain here uh and you can go ahead and visit the page so it's not
11:44:26
going to be immediately visible but one thing you can already do is click here and just copy that URL and let's go
11:44:34
ahead and let's go inside the variables right here and remember we have a variable inside of our socket i o so let
11:44:41
me just find the socket provider here we have to add this next public site URL environment so let's go ahead inside of
11:44:48
the raw editor inside of our variables and at the end at the next underscore public underscore site underscore URL to
11:44:56
be this new domain that we have just remove the slash at the end so don't
11:45:01
just remove this slash like that and click update variables perfect and that is going to schedule a redeploy so just
11:45:08
go back to your deployments and wait for you want to appear so I'm going to refresh and there we go this one is
11:45:14
building now so let's wait for that to finish great so now it redeployed because I added a new environment variable now I'm
11:45:21
going to go ahead and visit it again and there we go you can see my clerk login so let me try and log in now and there
11:45:29
we go I am uh in production with live real-time updates which means that my
11:45:34
websocket server is working and let's try real-time message on deployment
11:45:40
like that so I just butchered that and there we go it works I can also delete that message in real time beautiful I
11:45:49
can change to light mode Let's go ahead and edit the message like that and that is in real time as
11:45:56
well great great job and thank you so much for watching this video see you in the next one
