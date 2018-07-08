# [USACO]Promotion Counting
[BZOJ4756 Luogu3605]

The cows have once again tried to form a startup company, failing to remember from past experience that cows make terrible managers!  
The cows, conveniently numbered $1 \ldots N$ ( $1 \leq N \leq 100,000$ ), organize the company as a tree, with cow 1 as the president (the root of the tree). Each cow except the president has a single manager (its &quot;parent&quot; in the tree). Each cow $i$ has a distinct proficiency rating, $p(i)$ , which describes how good she is at her job. If cow $i$ is an ancestor (e.g., a manager of a manager of a manager) of cow $j$ , then we say $j$ is a subordinate of $i$ .  
Unfortunately, the cows find that it is often the case that a manager has less proficiency than several of her subordinates, in which case the manager should consider promoting some of her subordinates. Your task is to help the cows figure out when this is happening. For each cow $i$ in the company, please count the number of subordinates $j$ where $p(j) &gt; p(i)$ .  
奶牛们又一次试图创建一家创业公司，还是没有从过去的经验中吸取教训--牛是可怕的管理者！  
为了方便，把奶牛从 $1 \cdots N(1 \leq N \leq 100, 000)$ 编号，把公司组织成一棵树，1 号奶牛作为总裁（这棵树的根节点）。除了总裁以外的每头奶牛都有一个单独的上司（它在树上的 “双亲结点”）。所有的第 $i$ 头牛都有一个不同的能力指数 $p(i)$ ，描述了她对其工作的擅长程度。如果奶牛 $i$ 是奶牛 $j$ 的祖先节点（例如，上司的上司的上司），那么我们我们把奶牛 $j$ 叫做 $i$ 的下属。  
不幸地是，奶牛们发现经常发生一个上司比她的一些下属能力低的情况，在这种情况下，上司应当考虑晋升她的一些下属。你的任务是帮助奶牛弄清楚这是什么时候发生的。简而言之，对于公司的中的每一头奶牛 $i$ ，请计算其下属 $j$ 的数量满足 $p(j) &gt; p(i)$ 。

权值线段树自底向上合并，查询比当前点值域大的数的个数。

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

const int maxN=101000;
const int inf=2147483647;

class SegmentData
{
public:
	int ls,rs,sum;
};

int n;
vector<int> To[maxN];
int numcnt,Num[maxN],Val[maxN],Ans[maxN];
int nodecnt,root[maxN];
SegmentData S[maxN*50];

void dfs(int u);
void Modify(int &now,int l,int r,int pos,int key);
int Query(int now,int l,int r,int ql,int qr);
int Merge(int r1,int r2);

int main()
{
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d",&Val[i]),Num[++numcnt]=Val[i];
	Num[++numcnt]=inf;
	
	sort(&Num[1],&Num[numcnt+1]);numcnt=unique(&Num[1],&Num[numcnt+1])-Num-1;
	for (int i=1;i<=n;i++) Val[i]=lower_bound(&Num[1],&Num[numcnt+1],Val[i])-Num;

	for (int i=2;i<=n;i++)
	{
		int fa;scanf("%d",&fa);
		To[fa].push_back(i);
	}

	dfs(1);

	for (int i=1;i<=n;i++) printf("%d\n",Ans[i]);
	return 0;
}

void dfs(int u)
{
	int sz=To[u].size();
	for (int i=0;i<sz;i++){
		dfs(To[u][i]);root[u]=Merge(root[u],root[To[u][i]]);
	}
	Ans[u]=Query(root[u],1,numcnt,Val[u]+1,numcnt);
	Modify(root[u],1,numcnt,Val[u],1);
	return;
}

void Modify(int &now,int l,int r,int pos,int key)
{
	S[++nodecnt]=S[now];now=nodecnt;
	S[now].sum+=key;
	if (l==r) return;
	int mid=(l+r)>>1;
	if (pos<=mid) Modify(S[now].ls,l,mid,pos,key);
	else Modify(S[now].rs,mid+1,r,pos,key);
	return;
}

int Query(int now,int l,int r,int ql,int qr)
{
	if (now==0) return 0;
	if ((l==ql)&&(r==qr)) return S[now].sum;
	int mid=(l+r)>>1;
	if (qr<=mid) return Query(S[now].ls,l,mid,ql,qr);
	else if (ql>=mid+1) return Query(S[now].rs,mid+1,r,ql,qr);
	else return Query(S[now].ls,l,mid,ql,mid)+Query(S[now].rs,mid+1,r,mid+1,qr);
}

int Merge(int r1,int r2)
{
	if (r1==0) return r2;
	if (r2==0) return r1;
	int now=++nodecnt;
	S[now].sum=S[r1].sum+S[r2].sum;
	S[now].ls=Merge(S[r1].ls,S[r2].ls);
	S[now].rs=Merge(S[r1].rs,S[r2].rs);
	return now;
}
```