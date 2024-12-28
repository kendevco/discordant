import { JSONTree } from 'react-json-tree';

export const MessageContentViewer = ({ content }: { content: string }) => {
  try {
    const data = JSON.parse(content);

    if (data.type === "image_analysis") {
      return (
        <div className="rounded-lg bg-black/10 p-4">
          <h3 className="text-lg font-semibold">{data.summary}</h3>
          <div className="mt-2 space-y-2">
            {data.objects && (
              <div>
                <h4 className="font-medium">Detected Objects:</h4>
                <div className="flex flex-wrap gap-1">
                  {data.objects.map((obj: string) => (
                    <span key={obj} className="rounded bg-blue-100 px-2 py-1 text-sm">
                      {obj}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <JSONTree data={data} theme="monokai" />
          </div>
        </div>
      );
    }

    return <p>{content}</p>;
  } catch {
    return <p>{content}</p>;
  }
}; 