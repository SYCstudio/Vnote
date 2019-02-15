# [PA2014]Plemiona
[BZOJ3719]

远古时代，在吉丽王国的版图上分布着n个部落。建立平面直角坐标系后，每个部落都是一个边平行于坐标轴的矩形。有些地盘可能同时属于多个部落。随着时间推移，部落之间会发生融合。具体来说，若两个部落的公共面积严格大于零，它们会合并成一个新的部落，新部落的形状是包含原来两个部落的最小矩形（边平行于坐标轴）。
数百万年后，部落之间终于达到了稳定状态（任两个部落都不能再合并了），然而吉丽也已经老了。他想知道最终还剩下几个部落，以及各个部落的位置。你能替他完成遗业吗？

首先把是一条线的矩形单独提出来，提前放进答案里。把其它矩形按照上边界排序，那么如果依次插入矩形，前一个的上边界大于当前的下边界，则只需要看横方向是否有交。对横坐标维护一个线段树，把每一个区间放到线段树的$log$个区间上，可以发现两个矩形横坐标相交当且仅当在线段树上它们有节点成父子关系。  
那么对线段树的每一个节点维护两个以上边界为序的单调栈，一个单调栈存刚好覆盖当前整个区间的矩形编号，另一个存存在一部分在这个区间的矩形编号。查询的时候，对于只经过的节点，查询刚好覆盖的，对于刚好覆盖的，查询存在一部分的。这样不断做，直到无交，则插入线段树继续下一步。  
注意判断边界情况。为了方便期间，可以把右边界整体减一。

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
#define lson (now<<1)
#define rson (lson|1)

const int maxN=101000*3;
const int maxNum=1000000;
const int inf=2147483647;

class Rtg
{
public:
	int x1,x2,y1,y2;
};

class SegmentData{
public:
	vector<int> A,B;
};

int n;
Rtg R[maxN],A[maxN];
vector<int> St;
SegmentData S[maxNum<<2];
bool vis[maxN];

bool cmp1(Rtg A,Rtg B);
bool cmp2(Rtg A,Rtg B);
void Query(int now,int l,int r,int ql,int qr,int id);
void Modify(int now,int l,int r,int ql,int qr,int id);

int main(){
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d%d%d%d",&R[i].x1,&R[i].x2,&R[i].y1,&R[i].y2);
	int ncnt=0,acnt=0;
	for (int i=1;i<=n;i++)
		if ((R[i].x1==R[i].x2)||(R[i].y1==R[i].y2)) A[++acnt]=R[i];
		else R[++ncnt]=R[i];
	n=ncnt;

	sort(&R[1],&R[n+1],cmp1);
	for (int i=1;i<=n;i++) R[i].x2--;
	for (int i=1;i<=acnt;i++) A[i].x2--;
	int nnn=n;
	for (int i=1;i<=nnn;i++){
		int now=i;
		do{
			St.clear();
			Query(1,0,maxNum,R[now].x1,R[now].x2,now);
			if (St.empty()) break;
			int sz=St.size();
			R[++n]=R[now];vis[now]=1;
			for (int j=0;j<sz;j++){
				vis[St[j]]=1;
				R[n].x1=min(R[n].x1,R[St[j]].x1);
				R[n].x2=max(R[n].x2,R[St[j]].x2);
				R[n].y1=min(R[n].y1,R[St[j]].y1);
				R[n].y2=max(R[n].y2,R[St[j]].y2);
			}
			now=n;
			St.clear();
		}
		while (1);
		Modify(1,0,maxNum,R[now].x1,R[now].x2,now);
	}

	for (int i=1;i<=n;i++) if (vis[i]==0) A[++acnt]=R[i];
	sort(&A[1],&A[acnt+1],cmp2);

	printf("%d\n",acnt);
	for (int i=1;i<=acnt;i++) printf("%d %d %d %d\n",A[i].x1,A[i].x2+1,A[i].y1,A[i].y2);

	return 0;
}

bool cmp1(Rtg A,Rtg B){
	return A.y2<B.y2;
}

bool cmp2(Rtg A,Rtg B){
	if (A.x1==B.x1){
		if (A.x2==B.x2){
			if (A.y1==B.y1)
				return A.y2<B.y2;
			else return A.y1<B.y1;
		}
		else return A.x2<B.x2;
	}
	else return A.x1<B.x1;
}

void Query(int now,int l,int r,int ql,int qr,int id){
	int sz,p;
	while ((sz=S[now].A.size())&&(vis[S[now].A[sz-1]])) S[now].A.pop_back();
	while ((sz=S[now].B.size())&&(vis[S[now].B[sz-1]])) S[now].B.pop_back();
	
	if ((l==ql)&&(r==qr)){
		while (sz=S[now].B.size()){
			if (vis[S[now].B[sz-1]]){
				S[now].B.pop_back();continue;
			}
			if (R[p=S[now].B[sz-1]].y2>R[id].y1){
				St.push_back(p);S[now].B.pop_back();vis[p]=1;
			}
			else break;
		}
		return;
	}

	while (sz=S[now].A.size()){
		if (vis[S[now].A[sz-1]]){
			S[now].A.pop_back();continue;
		}
		if (R[p=S[now].A[sz-1]].y2>R[id].y1){
			St.push_back(p);S[now].A.pop_back();vis[p]=1;
		}
		else break;
	}

	int mid=(l+r)>>1;
	if (qr<=mid) Query(lson,l,mid,ql,qr,id);
	else if (ql>=mid+1) Query(rson,mid+1,r,ql,qr,id);
	else{
		Query(lson,l,mid,ql,mid,id);Query(rson,mid+1,r,mid+1,qr,id);
	}
	return;
}

void Modify(int now,int l,int r,int ql,int qr,int id){
	int sz;
	while ((sz=S[now].A.size())&&(vis[S[now].A[sz-1]])) S[now].A.pop_back();
	while ((sz=S[now].B.size())&&(vis[S[now].B[sz-1]])) S[now].B.pop_back();
	S[now].B.push_back(id);
	if ((l==ql)&&(r==qr)){
		S[now].A.push_back(id);
		return;
	}
	int mid=(l+r)>>1;
	if (qr<=mid) Modify(lson,l,mid,ql,qr,id);
	else if (ql>=mid+1) Modify(rson,mid+1,r,ql,qr,id);
	else{
		Modify(lson,l,mid,ql,mid,id);Modify(rson,mid+1,r,mid+1,qr,id);
	}
	return;
}
```