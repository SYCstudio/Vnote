# [集训队互测2015]Robot
[BZOJ3938 UOJ88]

小q有n只机器人，一开始他把机器人放在了一条数轴上，第i只机器人在ai的位置上静止，而自己站在原点。在这之后小q会执行一些操作，他想要命令一个机器人向左或者向右移动x格。但是机器人似乎听不清小q的命令，事实上它们会以每秒x格的速度匀速移动。看着自己的机器人越走越远，小q很着急，他想知道当前离他（原点）最远的机器人有多远。具体的操作以及询问见输入格式。注意，不同的机器人之间互不影响，即不用考虑两个机器人撞在了一起的情况。

先可以把所有的操作离线下来，得到每一状态的机器人能够影响的时间区间，可以发现的是，每一个机器人对于一段时间区间的影响是一个一次函数，而要求的答案就是这些一次函数中的最小值与最大值中绝对值更大的那个。那么把时间离散下来，对时间建立李超线段树维护区间一次函数最值。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define Dct(x) (lower_bound(&Num[1],&Num[num+1],x)-Num)
#define ls (x<<1)
#define rs (ls|1)

const int maxN=700000;
const int inf=2000000000;
const ll INF=1e18;

class Line{
public:
    ll a,b;
    ll calc(ll x){
	return a*x+b;
    }
};
class SegmentData{
public:
    Line L;int cov;
};
class Option{
public:
    int opt,t,k,v,nxt;
};

int n,Q;
int num,Num[maxN],Lst[maxN],Bgi[maxN];
Line Ip[maxN];
SegmentData Sa[maxN<<2],Si[maxN<<2];
Option O[maxN];

void Modify_max(int x,int l,int r,int ql,int qr,Line L);
void Modify_min(int x,int l,int r,int ql,int qr,Line L);
ll Query_max(int x,int l,int r,int p);
ll Query_min(int x,int l,int r,int p);

int main(){
    scanf("%d%d",&n,&Q);
    for (int i=1;i<=n;i++){
	int inal;scanf("%d",&inal);
	Ip[i]=((Line){0,inal});
    }
    for (int i=1;i<=Q;i++){
	scanf("%d",&O[i].t);Num[++num]=O[i].t;
	char ipt[10];scanf("%s",ipt);
	if (ipt[0]=='q'){
	    O[i].opt=2;continue;
	}
	scanf("%d%d",&O[i].k,&O[i].v);O[i].opt=1;
	if (Lst[O[i].k]) O[Lst[O[i].k]].nxt=O[i].t;
	else Bgi[O[i].k]=O[i].t;
	Lst[O[i].k]=i;
    }
    Num[++num]=0;Num[++num]=inf;
    for (int i=1;i<=n;i++)
	if (Lst[i]) O[Lst[i]].nxt=inf;
	else Bgi[i]=inf;

    sort(&Num[1],&Num[num+1]);num=unique(&Num[1],&Num[num+1])-Num-1;
    for (int i=1;i<=n;i++) Modify_max(1,1,num,1,Dct(Bgi[i]),Ip[i]),Modify_min(1,1,num,1,Dct(Bgi[i]),Ip[i]);
    for (int i=1;i<=Q;i++)
	if (O[i].opt==1){
	    if (Dct(O[i].t)>Dct(O[i].nxt)) continue;
	    int id=O[i].k;ll v=O[i].v,p=Ip[id].calc(O[i].t);
	    Ip[id]=((Line){v,p-v*O[i].t});
	    Modify_max(1,1,num,Dct(O[i].t),Dct(O[i].nxt),Ip[id]);
	    Modify_min(1,1,num,Dct(O[i].t),Dct(O[i].nxt),Ip[id]);
	}
	else{
	    ll r1=Query_max(1,1,num,Dct(O[i].t)),r2=Query_min(1,1,num,Dct(O[i].t));
	    printf("%lld\n",max(abs(r1),abs(r2)));
	}
    return 0;
}
void Modify_max(int x,int l,int r,int ql,int qr,Line L){
    if ((l==ql)&&(r==qr)){
	if (Sa[x].cov==0){
	    Sa[x].L=L;Sa[x].cov=1;return;
	}
	int mid=(l+r)>>1;ll tid=Num[mid],tl=Num[l],tr=Num[r];
	if ((Sa[x].L.calc(tl)>L.calc(tl))^(Sa[x].L.calc(tr)>L.calc(tr))){
	    if (Sa[x].L.calc(tid)<L.calc(tid)) swap(Sa[x].L,L);
	    if (L.calc(tl)>Sa[x].L.calc(tl)) Modify_max(ls,l,mid,ql,mid,L);
	    if (L.calc(tr)>Sa[x].L.calc(tr)) Modify_max(rs,mid+1,r,mid+1,qr,L);
	}
	else if ((Sa[x].L.calc(tl)<=L.calc(tl))&&(Sa[x].L.calc(tr)<=L.calc(tr))) Sa[x].L=L;
	return;
    }
    int mid=(l+r)>>1;
    if (qr<=mid) Modify_max(ls,l,mid,ql,qr,L);
    else if (ql>=mid+1) Modify_max(rs,mid+1,r,ql,qr,L);
    else Modify_max(ls,l,mid,ql,mid,L),Modify_max(rs,mid+1,r,mid+1,qr,L);
    return;
}
void Modify_min(int x,int l,int r,int ql,int qr,Line L){
    if ((l==ql)&&(r==qr)){
	if (Si[x].cov==0){
	    Si[x].L=L;Si[x].cov=1;return;
	}
	int mid=(l+r)>>1;ll tid=Num[mid],tl=Num[l],tr=Num[r];
	if ((Si[x].L.calc(tl)<L.calc(tl))^(Si[x].L.calc(tr)<L.calc(tr))){
	    if (Si[x].L.calc(tid)>L.calc(tid)) swap(L,Si[x].L);
	    if (L.calc(tl)<Si[x].L.calc(tl)) Modify_min(ls,l,mid,ql,mid,L);
	    if (L.calc(tr)<Si[x].L.calc(tr)) Modify_min(rs,mid+1,r,mid+1,qr,L);
	}
	else if ((Si[x].L.calc(tl)>=L.calc(tl))&&(Si[x].L.calc(tr)>=L.calc(tr))) Si[x].L=L;
	return;
    }
    int mid=(l+r)>>1;
    if (qr<=mid) Modify_min(ls,l,mid,ql,qr,L);
    else if (ql>=mid+1) Modify_min(rs,mid+1,r,ql,qr,L);
    else Modify_min(ls,l,mid,ql,mid,L),Modify_min(rs,mid+1,r,mid+1,qr,L);
    return;
}
ll Query_max(int x,int l,int r,int p){
    ll ret=(Sa[x].cov)?Sa[x].L.calc(Num[p]):-INF;
    if (l==r) return ret;
    int mid=(l+r)>>1;
    if (p<=mid) return max(ret,Query_max(ls,l,mid,p));
    else return max(ret,Query_max(rs,mid+1,r,p));
}
ll Query_min(int x,int l,int r,int p){
    ll ret=(Si[x].cov)?Si[x].L.calc(Num[p]):INF;
    if (l==r) return ret;
    int mid=(l+r)>>1;
    if (p<=mid) return min(ret,Query_min(ls,l,mid,p));
    else return min(ret,Query_min(rs,mid+1,r,p));
}
```