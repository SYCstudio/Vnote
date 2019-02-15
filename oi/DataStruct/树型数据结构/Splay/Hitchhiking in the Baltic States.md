# Hitchhiking in the Baltic States
[CF809D]

给你长度为 n 的序列，序列中的每个元素 i 有一个区间限制 [li,ri]，你从中选出一个子序列，并给它们标号 xi，要求满足 ∀i<j，xi<xj，且 ∀i，xi∈[li,ri]。 问满足条件子序列的长度最长为多少？ 1≤n≤3×10^5，1≤li≤ri≤10^9。

考虑最长上升子序列的二分栈做法，设 F[i] 表示当前长度为 i 的上升子序列的最后一个数的最小值。那么当在后面加入一个区间 [L,R] 时，会有若干转移，对于小的 u 满足 F[u]>=L ，和最大的 v 满足 F[v]<R 对于 F[u] ，一定是转移成 L ，因为原来是大于等于 L 的，而对于 (u,v] 之间的 DP 值，有 F[i]=F[i-1]+1 。对于最后一个数，如果是已经在二分栈末尾则直接增加一个数，说明二分栈长度 +1 ，否则删除掉。发现上述过程可以简化为对一个区间进行加法操作，插入一个节点和删除一个节点，用 Splay 维护这个序列。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=301000;
const int inf=1000000000;

class SplayData
{
public:
	int key,ch[2],fa,lz;
};

int n;
int root,nodecnt;
SplayData S[maxN];

void PushFa(int x);
void PushDown(int x);
void Plus(int x,int key);
void Rotate(int x);
void Splay(int x,int goal);
int Pre(int key);
int Nxt(int key);

int main(){
	root=1;nodecnt=2;
	S[1].key=-inf;S[2].key=inf;
	S[1].ch[1]=2;S[2].fa=1;
	scanf("%d",&n);
	int Ans=0;
	while (n--){
		int nl,nr;scanf("%d%d",&nl,&nr);
		int sl=Pre(nl),sr=Nxt(nr);
		Splay(sl,0);Splay(sr,sl);PushDown(sl);PushDown(sr);
		if (S[sr].ch[0]) Plus(S[sr].ch[0],1);
		int nps=sr;
		while (S[nps].ch[0]){
			nps=S[nps].ch[0];PushDown(nps);
		}
		S[++nodecnt].key=nl;S[nodecnt].fa=nps;S[nps].ch[0]=nodecnt;
		if (S[sr].ch[1]){
			PushDown(sr);
			int fl=S[sr].ch[0],fr=S[sr].ch[1];
			while (S[fl].ch[1]) PushDown(fl),fl=S[fl].ch[1];
			while (S[fr].ch[0]) PushDown(fr),fr=S[fr].ch[0];
			Splay(fl,0);Splay(fr,fl);
			S[fr].ch[0]=0;
		}
		else Ans++;
	}
	printf("%d\n",Ans);return 0;
}

void PushFa(int x){
	if (x==0) return;
	PushFa(S[x].fa);
	PushDown(x);return;
}

void PushDown(int x){
	if (S[x].lz){
		if (S[x].ch[0]) Plus(S[x].ch[0],S[x].lz);
		if (S[x].ch[1]) Plus(S[x].ch[1],S[x].lz);
		S[x].lz=0;
	}
	return;
}

void Plus(int x,int key){
	S[x].key+=key;S[x].lz+=key;return;
}

void Rotate(int x){
	int y=S[x].fa,z=S[y].fa;
	int sx=(x==S[y].ch[1]),sy=(y==S[z].ch[1]);
	S[x].fa=z;if (z) S[z].ch[sy]=x;
	S[y].ch[sx]=S[x].ch[sx^1];if (S[x].ch[sx^1]) S[S[x].ch[sx^1]].fa=y;
	S[x].ch[sx^1]=y;S[y].fa=x;return;
}

void Splay(int x,int goal){
	PushFa(x);
	while (S[x].fa!=goal){
		int y=S[x].fa,z=S[y].fa;
		if (z!=goal)
			((x==S[y].ch[0])^(y==S[z].ch[0]))?(Rotate(x)):(Rotate(y));
		Rotate(x);
	}
	if (goal==0) root=x;
}

int Pre(int key){
	int now=root,lst=root,ret=root;
	while (now){
		lst=now;PushDown(now);
		if (S[now].key<key) ret=now,now=S[now].ch[1];
		else now=S[now].ch[0];
	}
	Splay(lst,0);return ret;
}

int Nxt(int key){
	int now=root,lst=root,ret=root;
	while (now){
		lst=now;PushDown(now);
		if (S[now].key>=key) ret=now,now=S[now].ch[0];
		else now=S[now].ch[1];
	}
	Splay(lst,0);return ret;
}
```