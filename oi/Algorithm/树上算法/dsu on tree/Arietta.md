# Arietta
[BZOJ3681]

Arietta 的命运与她的妹妹不同,在她的妹妹已经走进学院的时候,她仍然留在山村中。  
但是她从未停止过和恋人 Velding 的书信往来。一天,她准备去探访他。  
对着窗外的阳光,临行前她再次弹起了琴。  
她的琴的发声十分特殊。  
让我们给一个形式化的定义吧。  
所有的 n 个音符形成一棵由音符 C ( 1 号节点) 构成的有根树,每一个音符有一个音高 Hi 。  
Arietta 有 m 个力度,第 i 个力度能弹出 Di 节点的子树中,音高在 [Li,Ri] 中的任意一个音符。  
为了乐曲的和谐,Arietta 最多会弹奏第 i 个力度 Ti 次。  
Arietta 想知道她最多能弹出多少个音符。

一个最大匹配的问题。一个简单的想法，对于每一个点建立关于它子树音高的线段树，然后就可以线段树优化建边。但是不好直接建图，也不能直接可持久化线段树，因为连边不支持减法操作，所以采用$dsu\ on\ tree$的方式。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<vector>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=10005;
const int inf=10100;

class Question
{
public:
	int l,r,id;
};

class SegmentData
{
public:
	int ls,rs;
};

int n,m;
vector<int> Son[maxN];
int Height[maxN],Hson[maxN],Size[maxN],dfncnt,fst[maxN],lst[maxN],Id[maxN];
Question Qn[maxN];
int nodecnt=0,root[maxN];
SegmentData S[maxN*100];

void dfs1(int u);
void dfs2(int u);
void Modify(int &now,int l,int r,int pos,int id);
void Add(int now,int l,int r,int ql,int qr,int id);

namespace Flow
{
	const int maxNode=maxN*100;
	const int maxM=maxN*170;
	
	class Edge
	{
	public:
		int v,flow;
	};

	int S,T;
	int edgecnt=-1,Head[maxNode],Next[maxM];
	Edge E[maxM];
	int Q[maxNode],cur[maxNode],Depth[maxNode];

	void Init();
	void Add_Edge(int u,int v,int flow);
	bool Bfs();
	int dfs(int u,int flow);
	int MxFlow();
}

int main(){
	//freopen("5.in","r",stdin);
	Flow::Init();
	scanf("%d%d",&n,&m);
	Flow::S=n+1;Flow::T=n+2;
	for (int i=1;i<=n;i++) Flow::Add_Edge(i,Flow::T,1);
	
	for (int i=2;i<=n;i++){
		int fa;scanf("%d",&fa);Son[fa].push_back(i);
	}
	for (int i=1;i<=n;i++) scanf("%d",&Height[i]);
	for (int i=1;i<=m;i++){
		int l,r,d,t;scanf("%d%d%d%d",&l,&r,&d,&t);
		Flow::Add_Edge(Flow::S,n+2+i,t);
		Qn[i]=((Question){l,r,d});
	}

	dfs1(1);
	dfs2(1);

	for (int i=1;i<=m;i++) Add(root[Qn[i].id],1,n,Qn[i].l,Qn[i].r,i);

	printf("%d\n",Flow::MxFlow());

	return 0;
}

void dfs1(int u)
{
	Size[u]=1;Id[fst[u]=++dfncnt]=u;
	for (int sz=Son[u].size(),i=0;i<sz;i++)
	{
		dfs1(Son[u][i]);Size[u]+=Size[Son[u][i]];
		if (Size[Hson[u]]<Size[Son[u][i]]) Hson[u]=Son[u][i];
	}
	lst[u]=dfncnt;return;
}

void dfs2(int u)
{
	for (int sz=Son[u].size(),i=0;i<sz;i++)
		if (Son[u][i]!=Hson[u]) dfs2(Son[u][i]);
	if (Hson[u]) dfs2(Hson[u]);

	root[u]=root[Hson[u]];
	Modify(root[u],1,n,Height[u],u);
	for (int sz=Son[u].size(),i=0;i<sz;i++)
		if (Son[u][i]!=Hson[u]){
			//cout<<"dfs2-add:"<<u<<" "<<Son[u][i]<<endl;
			for (int j=fst[Son[u][i]];j<=lst[Son[u][i]];j++)
				Modify(root[u],1,n,Height[Id[j]],Id[j]);
		}

	//for (int sz=Qn[u].size(),i=0;i<sz;i++)
	//	Add(root[u],1,n,Qn[u][i].l,Qn[u][i].r,Qn[u][i].id);

	return;
}

void Modify(int &now,int l,int r,int pos,int id)
{
	S[++nodecnt]=S[now];
	if (now) Flow::Add_Edge(n+m+2+nodecnt,n+m+2+now,inf);
	now=nodecnt;
	if (l==r){
		Flow::Add_Edge(n+m+2+now,id,1);return;
	}

	int mid=(l+r)>>1;
	if (pos<=mid){
		Modify(S[now].ls,l,mid,pos,id);
		if (S[now].ls) Flow::Add_Edge(n+m+2+now,n+m+2+S[now].ls,inf);
	}
	else{
		Modify(S[now].rs,mid+1,r,pos,id);
		if (S[now].rs) Flow::Add_Edge(n+m+2+now,n+m+2+S[now].rs,inf);
	}
	return;
}

void Add(int now,int l,int r,int ql,int qr,int id)
{
	if (now==0) return;
	if ((l==ql)&&(r==qr)){
		Flow::Add_Edge(n+2+id,n+m+2+now,inf);return;
	}

	int mid=(l+r)>>1;
	if (qr<=mid) Add(S[now].ls,l,mid,ql,qr,id);
	else if (ql>=mid+1) Add(S[now].rs,mid+1,r,ql,qr,id);
	else{
		Add(S[now].ls,l,mid,ql,mid,id);
		Add(S[now].rs,mid+1,r,mid+1,qr,id);
	}
	return;
}

namespace Flow
{
	void Init(){
		edgecnt=-1;mem(Head,-1);return;
	}
	
	void Add_Edge(int u,int v,int flow){
		Next[++edgecnt]=Head[u];Head[u]=edgecnt;E[edgecnt]=((Edge){v,flow});
		Next[++edgecnt]=Head[v];Head[v]=edgecnt;E[edgecnt]=((Edge){u,0});
		return;
	}
	
	int MxFlow(){
		int ret=0;
		while (Bfs())
		{
			for (int i=1;i<maxNode;i++) cur[i]=Head[i];
			while (int di=dfs(S,inf)) ret+=di;
		}
		return ret;
	}
	
	bool Bfs()
	{
		mem(Depth,-1);Depth[S]=1;Q[1]=S;
		int h=1,t=0;
		do
			for (int u=Q[++t],i=Head[u];i!=-1;i=Next[i])
				if ((E[i].flow>0)&&(Depth[E[i].v]==-1))
					Depth[Q[++h]=E[i].v]=Depth[u]+1;
		while (t!=h);
		return Depth[T]!=-1;
	}
	
	int dfs(int u,int flow)
	{
		if (u==T) return flow;
		for (int &i=cur[u];i!=-1;i=Next[i])
			if ((E[i].flow>0)&&(Depth[E[i].v]==Depth[u]+1))
				if (int di=dfs(E[i].v,min(flow,E[i].flow))){
					E[i].flow-=di;E[i^1].flow+=di;return di;
				}
		return 0;
	}
}
```