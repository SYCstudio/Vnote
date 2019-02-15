# Messages on a Tree
[CF725G]

Alice and Bob are well-known for sending messages to each other. This time you have a rooted tree with Bob standing in the root node and copies of Alice standing in each of the other vertices. The root node has number 0, the rest are numbered 1 through n.  
At some moments of time some copies of Alice want to send a message to Bob and receive an answer. We will call this copy the initiator. The process of sending a message contains several steps:

    The initiator sends the message to the person standing in the parent node and begins waiting for the answer.
    When some copy of Alice receives a message from some of her children nodes, she sends the message to the person standing in the parent node and begins waiting for the answer.
    When Bob receives a message from some of his child nodes, he immediately sends the answer to the child node where the message came from.
    When some copy of Alice (except for initiator) receives an answer she is waiting for, she immediately sends it to the child vertex where the message came from.
    When the initiator receives the answer she is waiting for, she doesn't send it to anybody.
    There is a special case: a copy of Alice can't wait for two answers at the same time, so if some copy of Alice receives a message from her child node while she already waits for some answer, she rejects the message and sends a message saying this back to the child node where the message came from. Then the copy of Alice in the child vertex processes this answer as if it was from Bob.
    The process of sending a message to a parent node or to a child node is instant but a receiver (a parent or a child) gets a message after 1 second. 

If some copy of Alice receives several messages from child nodes at the same moment while she isn't waiting for an answer, she processes the message from the initiator with the smallest number and rejects all the rest. If some copy of Alice receives messages from children nodes and also receives the answer she is waiting for at the same instant, then Alice first processes the answer, then immediately continue as normal with the incoming messages.  
You are given the moments of time when some copy of Alice becomes the initiator and sends a message to Bob. For each message, find the moment of time when the answer (either from Bob or some copy of Alice) will be received by the initiator.  
You can assume that if Alice wants to send a message (i.e. become the initiator) while waiting for some answer, she immediately rejects the message and receives an answer from herself in no time.

把所有询问按照发起点深度+发起时间进行排序，这样每一个点只会被它前面的点影响。考虑一个点 $a$ 如果在点 $v$ 被之间的某一个点 $b$ 挡住，当且仅当 $Depth[a]-Depth[v]+t[a] < Ans[b]-(Depth[b]-Depth[v])$ ，交换顺序得到 $Depth[a]+t[a] < Ans[b]-Depth[b]+2Depth[v]$ ，那么树链剖分+线段树维护区间最大值和支持其区间修改。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define lson (now<<1)
#define rson (lson|1)

const int maxN=201000;
const int maxM=maxN<<1;
const int inf=1000001111;

class SegmentData
{
public:
	int mx,dt,lz;
};

class Question
{
public:
	int id,u,tim,key;
};

int n,m;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
int Depth[maxN],Size[maxN],Fa[maxN],Top[maxN],dfncnt,dfn[maxN],nfd[maxN];
SegmentData S[maxN<<2];
Question Qn[maxN];
int Ans[maxN];

void Add_Edge(int u,int v);
void dfs1(int u,int fa);
void dfs2(int u,int fa);
void Build(int now,int l,int r);
void Max(int now,int key);
void PushDown(int now);
void Modify(int now,int l,int r,int ql,int qr,int key);
int Query(int now,int l,int r,int ql,int qr);
int Calc(int u,int tim);
bool cmp(Question A,Question B);

int main(){
	mem(Head,-1);
	scanf("%d%d",&n,&m);n++;
	for (int i=2;i<=n;i++){
		int fa;scanf("%d",&fa);fa++;
		Add_Edge(i,fa);Add_Edge(fa,i);
	}

	Depth[1]=1;
	dfs1(1,1);dfs2(1,1);
	Build(1,1,n);

	for (int i=1;i<=m;i++){
		int pos,tim;scanf("%d%d",&pos,&tim);pos++;
		Qn[i].id=i;Qn[i].u=pos;Qn[i].tim=tim;Qn[i].key=Depth[pos]+tim;
	}

	sort(&Qn[1],&Qn[m+1],cmp);
	for (int i=1;i<=m;i++) Ans[Qn[i].id]=Calc(Qn[i].u,Qn[i].tim);

	for (int i=1;i<=m;i++) printf("%d\n",Ans[i]);

	return 0;
}

void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	return;
}

void dfs1(int u,int fa){
	Size[u]=1;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa){
			Depth[V[i]]=Depth[u]+1;Fa[V[i]]=u;
			dfs1(V[i],u);Size[u]+=Size[V[i]];
		}
	return;
}

void dfs2(int u,int top){
	nfd[dfn[u]=++dfncnt]=u;Top[u]=top;
	int hson=maxN-1;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=Fa[u])
			if (Size[V[i]]>Size[hson]) hson=V[i];
	if (hson==maxN-1) return;
	dfs2(hson,top);
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((V[i]!=Fa[u])&&(V[i]!=hson))
			dfs2(V[i],V[i]);
	return;
}

void Build(int now,int l,int r){
	S[now].lz=-inf;
	if (l==r){
		S[now].dt=Depth[nfd[l]]*2;
		return;
	}
	int mid=(l+r)>>1;
	Build(lson,l,mid);Build(rson,mid+1,r);
	S[now].dt=max(S[lson].dt,S[rson].dt);return;
}

void Max(int now,int key){
	S[now].mx=max(S[now].mx,S[now].dt+key);
	S[now].lz=max(S[now].lz,key);
	return;
}

void PushDown(int now){
	if (S[now].lz!=-inf){
		Max(lson,S[now].lz);Max(rson,S[now].lz);
		S[now].lz=-inf;
	}
	return;
}

void Modify(int now,int l,int r,int ql,int qr,int key){
	if ((l==ql)&&(r==qr)){
		Max(now,key);return;
	}
	PushDown(now);int mid=(l+r)>>1;
	if (qr<=mid) Modify(lson,l,mid,ql,qr,key);
	else if (ql>=mid+1) Modify(rson,mid+1,r,ql,qr,key);
	else{
		Modify(lson,l,mid,ql,mid,key);Modify(rson,mid+1,r,mid+1,qr,key);
	}
	S[now].mx=max(S[lson].mx,S[rson].mx);return;
}

int Query(int now,int l,int r,int ql,int qr){
	if ((l==ql)&&(r==qr)) return S[now].mx;
	PushDown(now);int mid=(l+r)>>1;
	if (qr<=mid) return Query(lson,l,mid,ql,qr);
	else if (ql>=mid+1) return Query(rson,mid+1,r,ql,qr);
	else return max(Query(lson,l,mid,ql,mid),Query(rson,mid+1,r,mid+1,qr));
}

int Calc(int u,int tim){
	int key=tim+Depth[u];
	int now=u;
	while (now!=0){
		if (Query(1,1,n,dfn[Top[now]],dfn[now])<=key) now=Fa[Top[now]];
		else if (Query(1,1,n,dfn[now],dfn[now])>key) break;
		else{
			int l=dfn[Top[now]],r=dfn[now],rt=dfn[now];
			do{
				int mid=(l+r)>>1;
				if (Query(1,1,n,mid,dfn[now])<=key) rt=mid,r=mid-1;
				else l=mid+1;
			}
			while (l<=r);
			now=Fa[nfd[rt]];break;
		}
	}
	if (now==0) now=1;
	int Ret=tim+2*(Depth[u]-Depth[now]);
	int tp=now;now=u;
	while (Top[now]!=Top[tp]){
		Modify(1,1,n,dfn[Top[now]],dfn[now],Ret-Depth[u]);
		now=Fa[Top[now]];
	}
	Modify(1,1,n,dfn[tp],dfn[now],Ret-Depth[u]);
	return Ret;
}

bool cmp(Question A,Question B){
	if (A.key!=B.key) return A.key<B.key;
	else return A.u<B.u;
}
```