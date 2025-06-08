"use client";

import { RichContentRenderer } from "./rich-content-renderer";

const testMarkdownContent = `Here are some great dog parks in Central Florida that you can drive to in under 3 hours from Clearwater, perfect for taking your three dogs along! 🐾🚐

### 🐶 Dog Parks in Central Florida

1. **[Dog Friendly Things to Do - Visit Central Florida](https://visitcentralflorida.org/types/dog-parks/)**
   - **Overview:** This resource highlights various off-leash dog parks in Polk County, including locations in Lakeland, Winter Haven, Lake Wales, Auburndale, and Davenport.
   - **Tip:** Plan your trip with dog-friendly hotels if you need an overnight stay!

2. **[The Dog Bar - St. Petersburg, FL](https://www.bringfido.com/attraction/parks/state/florida/)**
   - **Overview:** A unique combination of a private, off-leash dog park and a full-service sports bar. Located in the Grand Central District, it requires a membership for dogs to ensure a safe environment.
   - **Fun Fact:** It's a great spot for both dogs and their humans to socialize!

3. **[Top 10 Dog Parks to Explore with Your Pup](https://lalenasellsrealestate.com/central-florida-for-dog-lovers-top-10-dog-parks-to-explore-with-your-pup/)**
   - **Overview:** This article provides tips for exploring Central Florida's dog parks, including hydration, leash laws, and cleaning up after your pets.
   - **Recommendation:** Always check if the park allows off-leash play!

### Next Steps:
- Check out the links for more details on each park.
- Plan your visit based on the distance and your dogs' needs!

If you need further assistance, visit https://example.com for more information.`;

export const MarkdownTest = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Markdown Link Test</h2>
      <div className="bg-zinc-900 p-4 rounded-lg">
        <RichContentRenderer content={testMarkdownContent} isSystemMessage={true} />
      </div>
    </div>
  );
}; 